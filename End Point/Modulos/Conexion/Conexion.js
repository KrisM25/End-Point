const mysql = require('mysql2');

function conexion() {
    // Crea una conexión a la base de datos
const conxion = mysql.createConnection({
    host: 'jyjtechsolutions.com',
    user: 'u481278819_marysmk',
    password: 'Marys2024',
    database: 'u481278819_marysmakeup'
});

// Conecta a la base de datos
conxion.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos.');
});
return conxion;
}

module.exports = conexion;