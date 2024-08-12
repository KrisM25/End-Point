//importación de los módulos
const conexion = require("../Conexion/Conexion.js");


/**
 * Función para retornar la lista de productos
 * @param {*} req Listado de parámetros a recibir
 * @param {*} res Retorno de respuestas (de errores y exitosas)
*/


//Funcion para Listar todos Los Productos
function listarTodosLosProductos(req, res){const conn = conexion();
    conn.query(
        "select * from productos",
        (error, results) => {
            if(error){
                //arrojamos un estado 500 (error interno del servidor)
                return res.status(500).json({estado:false,mensaje:error});
            }else{
                //en caso de todo estar ok, arrojamos un estado 200 (exitoso)
                return res.status(200).json({estado: true,data:results});
            }
        }
    )
}



//Busca producto por ID
function consultaProductoId(req, res) {
    const conn = conexion()
    const { id } = req.body;
    console.log(req.body);

    // Consulta para traer las marcas de la base de datos con el parámetro id_p
    const consultaSQL = "Select * from productos where id= ?";

    conn.query(consultaSQL, [id], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            if (results.length > 0) {
                res.status(200).json({ estado: true, data: results });
            } else {
                res.status(200).json({ estado: false, mensaje: "No existen productos con ese id" });
            }
        }
    })
}



// Función para agregar un nuevo producto
function agregarProducto(req, res) {
    const conn = conexion();
    const { id, nombreProducto, marca, stock, PrecioProducto } = req.body;

    // Verifica que los parámetros id y nombre_marca estén en el cuerpo de la solicitud
    if (!id || !nombreProducto || !marca || !stock || ! PrecioProducto ) {
        return res.status(400).json({
            estado: false,
            mensaje: "Se requieren los datos completos"
        });
    }

    // Consulta SQL para insertar la nueva marca en la base de datos
    const consultaSQL = "INSERT INTO productos (id, nombreProducto, marca, stock, PrecioProducto ) VALUES (?, ?, ?, ?, ?)";

    // Ejecuta la consulta
    conn.query(consultaSQL, [id, nombreProducto, marca, stock, PrecioProducto ], (err, results) => {
        if (err) {
            // Manejo de errores, como violación de clave primaria
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    estado: false,
                    mensaje: "El ID del producto ya existe."
                });
            }
            return res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error al agregar el producto: " + err
            });
        }

        // Responde con éxito
        res.status(200).json({
            estado: true,
            mensaje: "Producto agregado exitosamente",
            id: id // Devuelve el ID del producto agregado
        });
    });

}



// Función para actualizar un producto usando un procedimiento almacenado
function actualizarProducto(req, res) {
    const conn = conexion();
    const { id, nombreProducto, marca, stock, PrecioProducto } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Actualizar_Producto(?, ?, ?, ?, ?)";

    conn.query(procedimientoSQL, [id, nombreProducto, marca, stock, PrecioProducto], (err, results) => {
        if (err) {
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err
            });
        } else {
            res.status(200).json({ estado: true, mensaje: "Producto actualizado exitosamente." });
        }
        conn.end(); // Cierra la conexión
    });
}



// Función para eliminar un producto por ID usando un procedimiento almacenado
function eliminarProducto(req, res) {
    const conn = conexion();
    const { id } = req.body;
    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL u481278819_marysmakeup.Eliminar_Producto(?)";

    conn.query(procedimientoSQL, [id], (err, results) => {
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



module.exports = {listarTodosLosProductos, consultaProductoId, agregarProducto, actualizarProducto, eliminarProducto };