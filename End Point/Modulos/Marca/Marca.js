
//importación de los módulos
const conexion = require("../Conexion/Conexion.js");


/**
 * Función para retornar la lista de marcas
 * @param {*} req Listado de parámetros a recibir
 * @param {*} res Retorno de respuestas (de errores y exitosas)
*/


//Lista todas las marcas
function listarTodasLasMarcas(req, res) {
    const conn = conexion();
    conn.query(
        "select * from marcas",
        (error, results) => {
            if (error) {
                //arrojamos un estado 500 (error interno del servidor)
                return res.status(500).json({ estado: false, mensaje: error });
            } else {
                //en caso de todo estar ok, arrojamos un estado 200 (exitoso)
                return res.status(200).json({ estado: true, data: results });
            }
        }
    )
}



//Busca marcas por ID
function consultaMarcaId(req, res) {
    const conn = conexion()
    const { id_p } = req.body;
    console.log(req.body);

    // Consulta para traer las marcas de la base de datos con el parámetro id_p
    const consultaSQL = "Select * from marcas where id= ?";

    conn.query(consultaSQL, [id_p], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            if (results.length > 0) {
                res.status(200).json({ estado: true, data: results });
            } else {
                res.status(200).json({ estado: false, mensaje: "No existen marcas con ese id" });
            }
        }
    })
}




// Función para agregar una nueva marca
function agregarMarca(req, res) {
    const conn = conexion();
    const { id, nombre_marca } = req.body;

    // Verifica que los parámetros id y nombre_marca estén en el cuerpo de la solicitud
    if (!id || !nombre_marca) {
        return res.status(400).json({
            estado: false,
            mensaje: "Se requieren el ID y el nombre de la marca"
        });
    }

    // Consulta SQL para insertar la nueva marca en la base de datos
    const consultaSQL = "INSERT INTO marcas (id, nombre_marca) VALUES (?, ?)";

    // Ejecuta la consulta
    conn.query(consultaSQL, [id, nombre_marca], (err, results) => {
        if (err) {
            // Manejo de errores, como violación de clave primaria
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El ID de la marca ya existe."
                });
            }
            return res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error al agregar la marca: " + err
            });
        }

        // Responde con éxito
        res.status(200).json({
            estado: true,
            mensaje: "Marca agregada exitosamente",
            id: id // Devuelve el ID de la marca agregada
        });
    });

}




// Función para actualizar una marca usando un procedimiento almacenado
function actualizarMarca(req, res) {
    const conn = conexion();
    const { id, nombre_Marca} = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Actualizar_Marca(?, ?)";

    conn.query(procedimientoSQL, [id, nombre_Marca], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: "Marca actualizada exitosamente." });
        }
        conn.end(); // Cierra la conexión
    });
}



// Función para eliminar una marca por ID usando un procedimiento almacenado
function eliminarMarca(req, res) {
    const conn = conexion();
    const { p_id } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Eliminar_Marca(?)";

    conn.query(procedimientoSQL, [p_id], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: results });
        }
        conn.end(); // Cierra la conexión
    });
}


//exportamos la funcion que desarrollamos
module.exports = { listarTodasLasMarcas, consultaMarcaId, agregarMarca, actualizarMarca, eliminarMarca };