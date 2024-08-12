
//importación de los módulos
const conexion = require("../Conexion/Conexion.js");


/**
 * Función para retornar la lista de marcas
 * @param {*} req Listado de parámetros a recibir
 * @param {*} res Retorno de respuestas (de errores y exitosas)
*/



//Listar Todos los clientes
function listaTodosLosClientes(req, res) {
    const conn = conexion();
    conn.query(
        "select * from clientes",
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




//Busca Clientes por ID
function consultaClienteId(req, res) {
    const conn = conexion()
    const { id_p } = req.body;
    console.log(req.body);

    // Consulta para traer las marcas de la base de datos con el parámetro id_p
    const consultaSQL = "Select * from clientes where id= ?";

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
                res.status(200).json({ estado: false, mensaje: "No existen clientes con ese id" });
            }
        }
    })
}




// Función para agregar un nuevo cliente
function agregarCliente(req, res) {
    const conn = conexion();
    const { idCliente, nombre, apellidos, telefono, correo } = req.body;

    // Verifica que los parámetros estén en el cuerpo de la solicitud
    if (!idCliente || !nombre || !apellidos || !telefono || !correo) {
        return res.status(400).json({
            estado: false,
            mensaje: "Se requieren todos los datos"
        });
    }

    // Consulta SQL para insertar el nuevo cliente en la base de datos
    const consultaSQL = "INSERT INTO clientes (idCliente, nombre, apellidos, telefono, correo) VALUES (?, ?, ?, ?, ?)";

    // Ejecuta la consulta
    conn.query(consultaSQL, [idCliente, nombre, apellidos, telefono, correo], (err, results) => {
        if (err) {
            // Manejo de errores, como violación de clave primaria
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El ID del cliente ya existe."
                });
            }
            return res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error al agregar el cliente: " + err
            });
        }

        // Responde con éxito
        res.status(200).json({
            estado: true,
            mensaje: "Cliente agregado exitosamente",
            idCliente: idCliente // Devuelve el ID del Cliente agregado
        });
    });
}



// Función para actualizar un cliente usando un procedimiento almacenado
function actualizarCliente(req, res) {
    const conn = conexion();
    const { idCliente, nombre, apellidos, telefono, correo} = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Actualizar_Cliente(?, ?, ?, ?, ?)";

    conn.query(procedimientoSQL, [idCliente, nombre, apellidos, telefono, correo], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: "Cliente actualizado exitosamente." });
        }
        conn.end(); // Cierra la conexión
    });
}




// Función para eliminar un cliente por ID usando un procedimiento almacenado
function eliminarCliente(req, res) {
    const conn = conexion();
    const { p_id } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Eliminar_Cliente(?)";

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
module.exports = { listaTodosLosClientes, consultaClienteId, agregarCliente , actualizarCliente, eliminarCliente};



