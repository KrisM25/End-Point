//Importación de los paquetes
const express = require("express"); //para el manejo de las rutas
const http = require("http"); //procesamiento de peticiones http (web)
const mysql = require("mysql"); //módulo para gestionar la base de datos (consultas, etc)
const cors = require("cors");


const {listarTodasLasMarcas, consultaMarcaId,agregarMarca, eliminarMarca, actualizarMarca} = require("../Modulos/Marca/Marca.js");
const { listarTodosLosProductos } = require("../Modulos/Productos/Productos.js");
const { listaTodosLosClientes, consultaClienteId, agregarCliente, actualizarCliente, eliminarCliente } = require("../Clientes/Clientes.js");
const { actualizarDetalle } = require("../Pedidos/DetallePedidos.js");


//Creación de una instancia de express
const app = express();

//vamos a indicarle al API que estará escuchando en el puerto 3000
const PORT = process.env.PORT || 3000;

//middleware para tener el acceso a las respuestas y peticiones del consumo
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}));


//empezamos a crear las rutas
app.get("/estado_api",(req, res) => {
    res.json(
        {
            estado: true,
            mensaje: "El servidor está online"
        }
    )
});

// MARCAS -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



app.post("/agregarMarca",(req, res) => {
    agregarMarca(req, res);
});



/**
 * @api {POST} Listar todas las marcas por id y nombre
 * @apiName listarTodasLasMarcas
 * @apiGroup Marcas
 * @apiDescription Lista todas las marcas en orden por su id y nombre
 * @apiSuccess {Boolean} estado indica el estado de la operacion
 * @apiSuccess {Object} data JSON con todas las maras
 * 
 * @apiError {Boolean} Estado de la peticion
 * @apiError {String} Descripcion del error
 * 
 * @apiExample
 * {
 *      ID: 1 , Nombre: NYX
 * }
 */
app.post("/listarTodasLasMarcas", (req, res) => {
    listarTodasLasMarcas(req, res);
});



app.post("/consultaMarcaId", (req, res) =>{
    consultaMarcaId(req, res);
})


app.post("/actualizarMarca", (req, res) => {
    actualizarMarca(req, res);
});



app.post("/eliminarMarca", (req, res) => {
    eliminarMarca(req, res);
});



// CLIENTES --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/listaTodosLosClientes", (req, res) => {
    listaTodosLosClientes(req, res);
});



app.post("/consultaClienteId", (req, res) => {
    consultaClienteId(req, res);
});



app.post("/agregarCliente", (req, res) => {
    agregarCliente(req, res);
});



app.post("/actualizarCliente", (req, res) => {
    actualizarCliente(req, res);
});



app.post("/eliminarCliente", (req, res) => {
    eliminarCliente(req, res);
});


// PRODUCTOS--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * @api {POST} Listar todas los productos
 * @apiName listarTodosLosProductos
 * @apiGroup Productos
 * @apiDescription Lista todos los productos por su id, nombre, marca, stock, proveedor y precio de cada producto.
 * @apiSuccess {Boolean} estado indica el estado de la operacion
 * @apiSuccess {Object} data JSON con todas las maras
 * 
 * @apiError {Boolean} Estado de la peticion
 * @apiError {String} Descripcion del error
 * 
 * @apiExample
 * {
 *    ID: 101, Nombre:Lip Gloss, Marca: 1, Stock: 10, Precio:5000
 * }
 */
app.post("/listarTodosLosProductos", (req, res) => {
    listarTodosLosProductos(req, res);
});



app.post("/consultaProductoId", (req, res) => {
    consultaProductoId(req, res);
});



app.post("/agregarProducto", (req, res) => {
    agregarProducto(req, res);
});



app.post("/actualizarProducto", (req, res) => {
    actualizarProducto(req, res);
});



app.post("/eliminarProducto", (req, res) => {
    eliminarProducto(req, res);
});


//Pedidos-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/listarTodosLosPedidos", (req, res) => {
    listarTodosLosPedidos(req, res);
});



app.post("/consultaPedidosId", (req, res) => {
    consultaProductoId(req, res);
});



app.post("/agregarPedido", (req, res) => {
    agregarPedido(req, res);
});



app.post("/actualizarPedido", (req, res) => {
    actualizarPedido(req, res);
});



app.post("/eliminarPedido", (req, res) => {
    eliminarPedido(req, res);
});


// DetallePedido----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post("/listarTodosLosDetalle", (req, res) => {
    listarTodosLosDetalle(req, res);
});



app.post("/ consultaDetalleId", (req, res) => {
    consultaDetalleId(req, res);
});



app.post("/agregarDetallePedido", (req, res) => {
    agregarDetallePedido(req, res);
});



app.post("/actualizarDetalle", (req, res) => {
    actualizarDetalle(req, res);
});



app.post("/eliminarDetalle", (req, res) => {
    eliminarDetalle(req, res);
});



// Facturacion--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//creamos el servidor
const server = http.createServer(app);
//le indicamos que estará escuchando en el puerto que definimos anteriormente
server.listen(PORT, () => { //Callback que se ejecuta cuando el puerto está listo

    console.log(`Servidor está escuchando en el puerto ${PORT}`);
});