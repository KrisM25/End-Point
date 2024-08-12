//importación de los módulos
const conexion = require("../Conexion/Conexion.js");

// Función para procesar una factura usando el procedimiento almacenado
function procesarFactura(req, res) {
    const conn = conexion;
    const { 
        cedula_cliente, 
        cod_prod, 
        unidades_compra, 
        nuevo, 
        descuento_aplicar, 
        nPedido, 
        CostoEnvio, 
        EstadoFactura 
    } = req.body;

    // Verifica que todos los parámetros necesarios estén presentes
    if (!cedula_cliente || !cod_prod || !unidades_compra || !nuevo || !descuento_aplicar || !nPedido || !CostoEnvio || !EstadoFactura) {
        return res.status(400).json({
            estado: false,
            mensaje: "Faltan parámetros en la solicitud."
        });
    }

    console.log(req.body);

    // Llamada al procedimiento almacenado
    const procedimientoSQL = "CALL SP_facturacion(?, ?, ?, ?, ?, ?, ?, ?)";

    conn.query(procedimientoSQL, [
        cedula_cliente, 
        cod_prod, 
        unidades_compra, 
        nuevo, 
        descuento_aplicar, 
        nPedido, 
        CostoEnvio, 
        EstadoFactura
    ], (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento almacenado:', err);
            res.status(500).json({
                estado: false,
                mensaje: "Ocurrió un error: " + err.message
            });
        } else {
            // Maneja el resultado del procedimiento almacenado
            const mensaje = results[0][0] ? results[0][0].mensaje : "Factura procesada exitosamente.";
            res.status(200).json({ 
                estado: mensaje === "Factura procesada exitosamente.", 
                mensaje 
            });
        }
    });
}

//exportamos la funcion que desarrollamos
module.exports = {procesarFactura};


