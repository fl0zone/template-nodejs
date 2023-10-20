const mysql = require('mysql'); 

const dbConfig = {
  host: 'localhost',
  user: 'nestor',
  password: 'advanta',
  database: 'as_comercializacion_web',
};

const connectToDatabase = async () => {
  const connection = mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

(async () => {
  try {
    const connection = await connectToDatabase();
    console.log('Conexión exitosa a la base de datos.');

    // Puedes realizar consultas y otras operaciones con la base de datos aquí

    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar la conexión: ' + err.message);
      } else {
        console.log('Conexión cerrada correctamente.');
      }
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos: ' + error.message);
  }
})();
