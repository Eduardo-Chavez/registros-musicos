//Importacion de los modulos
const mysql = require('mysql');
const { promisify }= require('util');

//Importar parametros del archivo keys (database)
const { database } = require('./keys');

//Enlace mediantes hilos
const pool = mysql.createPool(database);

//Mensajes de errores para situaciones de conexion
pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('La conexión a la base de datos se ha cerrado.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('La base de datos tiene demasiadas conexiones.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Se ha rechazado la conexión a la base de datos.');
      }
    }

    //Mensaje de conexion exitoso
    if (connection) connection.release();
    console.log('La conexion a la base de datos es correcta.');

  return;
});

//
pool.query = promisify(pool.query);

module.exports = pool;