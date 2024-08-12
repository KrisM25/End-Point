//importación de los módulos
const conexion = require("../Conexion/Conexion.js");


/**
 * Función para retornar la lista de marcas
 * @param {*} req Listado de parámetros a recibir
 * @param {*} res Retorno de respuestas (de errores y exitosas)
*/



//Lista todas las marcas
function listarTodosLosDetalle(req, res) {
    const conn = conexion();
    conn.query(
        "select * from detallePedido",
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



//Busca Detalle por ID
function consultaDetalleId(req, res) {
    const conn = conexion()
    const { id_Detalle } = req.body;
    console.log(req.body);

    // Consulta para traer las marcas de la base de datos con el parámetro id_p
    const consultaSQL = "Select * from detallePedido where id= ?";

    conn.query(consultaSQL, [id_Detalle], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            if (results.length > 0) {
                res.status(200).json({ estado: true, data: results });
            } else {
                res.status(200).json({ estado: false, mensaje: "No existen Detalles con ese id" });
            }
        }
    })
}



// Función para agregar un nuevo Detalle
function agregarDetallePedido(req, res) {
    const conn = conexion();
    const { id_Detalle, Producto, Cantidad_Comprada, Factura_Id } = req.body;

    // Verifica que los parámetros id y nombre_marca estén en el cuerpo de la solicitud
    if (! id_Detalle ||!Producto ||!Cantidad_Comprada ||!Factura_Id ) {
        return res.status(400).json({
            estado: false,
            mensaje: "Se requieren todos los datos"
        });
    }

    // Consulta SQL para insertar la nueva marca en la base de datos
    const consultaSQL = "INSERT INTO detallePedido (id_Detalle, Producto, Cantidad_Comprada, Factura_Id ) VALUES (?, ?, ?, ?)";

    // Ejecuta la consulta
    conn.query(consultaSQL, [id_Detalle, Producto, Cantidad_Comprada, Factura_Id ], (err, results) => {
        if (err) {
            // Manejo de errores, como violación de clave primaria
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El ID del detalle ya existe."
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
            mensaje: "Detalle agregado exitosamente",
            id_Detalle: id_Detalle // Devuelve el ID del detalle agregado
        });
    });

}



// Función para actualizar un detalle usando un procedimiento almacenado
function actualizarDetalle(req, res) {
    const conn = conexion();
    const { id_Detalle, Producto, Cantidad_Comprada, Factura_Id } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Actualizar_DetallePedido(?, ?, ?, ?)";

    conn.query(procedimientoSQL, [id_Detalle, Producto, Cantidad_Comprada, Factura_Id], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: "Detalle actualizado exitosamente." });
        }
        conn.end(); // Cierra la conexión
    });
}



// Función para eliminar un detalle por ID usando un procedimiento almacenado
function eliminarDetalle(req, res) {
    const conn = conexion();
    const {  id_Detalle, Producto, Cantidad_Comprada, Factura_Id  } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Eliminar_DetallePedido(?)";

    conn.query(procedimientoSQL, [ id_Detalle, Producto, Cantidad_Comprada, Factura_Id ], (err, results) => {
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
module.exports = { listarTodosLosDetalle, consultaDetalleId, agregarDetallePedido, actualizarDetalle, eliminarDetalle };

