
//importación de los módulos
const conexion = require("../Conexion/Conexion.js");


/**
 * Función para retornar la lista de marcas
 * @param {*} req Listado de parámetros a recibir
 * @param {*} res Retorno de respuestas (de errores y exitosas)
*/


//Lista todos los pedidos
function listaTodosLosPedidos(req, res) {
    const conn = conexion();
    conn.query(
        "select * from pedidos",
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



//Busca pedidos por ID
function consultaPedidoId(req, res) {
    const conn = conexion()
    const { idPedido } = req.body;
    console.log(req.body);

    // Consulta para traer las marcas de la base de datos con el parámetro id_p
    const consultaSQL = "Select * from pedidos where id= ?";

    conn.query(consultaSQL, [idPedido], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            if (results.length > 0) {
                res.status(200).json({ estado: true, data: results });
            } else {
                res.status(200).json({ estado: false, mensaje: "No existen pedidos con ese id" });
            }
        }
    })
}



// Función para agregar un nuevo pedido
function agregarPedido(req, res) {
    const conn = conexion();
    const { idPedido, cedulaClientePide, estado, FechaPedido, Nombre_Cliente } = req.body;

    // Verifica que los parámetros estén en el cuerpo de la solicitud
    if ( !idPedido || !cedulaClientePide || !estado || !FechaPedido || !Nombre_Cliente ) {
        return res.status(400).json({
            estado: false,
            mensaje: "Se requieren todos los datos"
        });
    }

    // Consulta SQL para insertar la nueva marca en la base de datos
    const consultaSQL = "INSERT INTO pedidos (idPedido, cedulaClientePide, estado, FechaPedido, Nombre_Cliente ) VALUES (?, ?, ?, ?, ?)";

    // Ejecuta la consulta
    conn.query(consultaSQL, [ idPedido, cedulaClientePide, estado, FechaPedido, Nombre_Cliente], (err, results) => {
        if (err) {
            // Manejo de errores, como violación de clave primaria
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El ID del pedido ya existe."
                });
            }
            return res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error al agregar el pedido: " + err
            });
        }

        // Responde con éxito
        res.status(200).json({
            estado: true,
            mensaje: "Pedido agregado exitosamente",
            idPedido: idPedido // Devuelve el ID del pedido agregado
        });
    });

}



// Función para actualizar un pedido usando un procedimiento almacenado
function actualizarPedido(req, res) {
    const conn = conexion();
    const {  idPedido, cedulaClientePide, estado, FechaPedido, Nombre_Cliente} = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Actualizar_Pedido(?, ?, ?, ?, ?)";

    conn.query(procedimientoSQL, [ idPedido, cedulaClientePide, estado, FechaPedido, Nombre_Cliente], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: "Pedido actualizado exitosamente." });
        }
        conn.end(); // Cierra la conexión
    });
}



// Función para eliminar un pedido por ID usando un procedimiento almacenado
function eliminarPedido(req, res) {
    const conn = conexion();
    const { idPedido } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Eliminar_Pedido(?)";

    conn.query(procedimientoSQL, [idPedido ], (err, results) => {
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



module.exports = {listaTodosLosPedidos, consultaPedidoId, agregarPedido, actualizarPedido, eliminarPedido };