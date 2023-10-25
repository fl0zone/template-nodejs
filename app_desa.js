const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const mssql = require('mssql');

const port = process.env.PORT ?? 3000;


// Config BD MySQL
const dbConfig = {
    host: '167.71.171.117',
    port: 3306,
    user: 'nestor',
    password: 'advanta',
    database: 'as.comercializacion.web', 
};


const connection = mysql.createConnection(dbConfig);

//Connect MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.message);
        return;
    }

    console.log('Conexión exitosa a la base de datos MySQL.');

    const app = express();

    app.use(express.json());
    app.use(cors())

    app.post('/users_login', (req, res) => {
        const { user_email, password } = req.body;

        connection.query(
            'SELECT * FROM mob_user WHERE PASSWORD = md5(?) AND EMAIL = ? AND ENABLED = 1',
            [password, user_email],
            (err, results) => {
                if (err) {
                    console.error('Error en la consulta: ' + err.message);
                    res.status(500).send('Error interno del servidor');
                    return;
                }

                if (results.length > 0) {
                    const usuario = results.map((row) => ({
                        USER_ID: row.USER_ID,
                        EMAIL: row.EMAIL,
                        NOMBRE: row.NOMBRE,
                        APELLIDO: row.APELLIDO,
                    }));
                    res.json({ usuario });
                } else {
                    res.json({ usuario: 0 });
                }
            }
        );
    });
    
    app.get('/articulos', async (req, res) => {
        try {
          // Create a connection pool
          const pool = await mssql.connect({
            server: '179.43.116.142',
            database: 'PuestoLob_Pick',
            user: 'qq',
            password: 'qq11',
            port: 1433,
            options: {
              trustedConnection: true,
              encrypt: false,
              trustServerCertificate: true,
            },
          });
    
          // Execute a query
          const result = await pool.request().query('SELECT * FROM M6_Picking');
    
          // Send the result as a response
          res.json(result.recordset);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
    });
    
    app.get('/articulos/cuenta/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if(!id) res.status(400).send('Invalid id argument');
        // Create a connection pool
        const pool = await mssql.connect({
          server: '179.43.116.142',
          database: 'PuestoLob_Pick',
          user: 'qq',
          password: 'qq11',
          port: 1433,
          options: {
            trustedConnection: true,
            encrypt: false,
            trustServerCertificate: true,
          },
        });
    
        // Execute a query
        const result = await pool.request().query(`SELECT * FROM M6_Picking where IDCtaCte = ${id}`);
    
        // Send the result as a response
        res.json(result.recordset);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    

    app.get('/getComisionista/:id/:idC', async (req, res) => {
        
        const { id, idC } = req.params;
        
        const qry = `SELECT cdb.*, mucdb.farmer_id
        from mob_user_by_client_database_connection as mucdb
        inner join client_database_connection as cdb on cdb.CLIENT_DATABASE_CONNECTION_ID = mucdb.CLIENT_DATABASE_CONNECTION_ID
        where mucdb.USER_ID  = ${id} 
        and mucdb.FARMER_ID  = ${idC}`;

        connection.query(qry, async (err, result) => {
            if (err) {
                console.error('Error en la consulta: ' + err.message);
                res.status(500).send('Error interno del servidor');
                return;
            }

            if (result.length === 0) {
                res.status(404).send('No se encontraron resultados para el ID proporcionado.');
            } else {
                // Iterar a través de los resultados de MySQL
                for (const cnx_remota of result) {
                    const servidor_externo = cnx_remota.URL;
                    const usuario_externo = cnx_remota.USER;
                    const password_externo = cnx_remota.PASSWORD;
                    const ddbb_externo = cnx_remota.DATABASE_NAME;

                    const Sqlconfig = {
                        user: usuario_externo,
                        password: password_externo,
                        server: servidor_externo,
                        database: ddbb_externo,
                        options: {
                            trustedConnection: true,
                            encrypt: false,
                            trustServerCertificate: true,
                        },
                    };

                    try {
                        const pool = await mssql.connect(Sqlconfig);
                        const request = pool.request();
                        request.input('IDComisionistas', mssql.Int, idC);

                        // Ejecutar la consulta SQL Server
                        const recordset = await request.execute('M0_CuentasCorrientesListaPorComisionista');
                        res.json(recordset.recordset);
                    } catch (error) {
                        console.error(`Error al conectar o ejecutar la consulta en ${servidor_externo}: ${error.message}`);
                        res.status(500).send('Error interno del servidor');
                    }
                }
            }
        });
    });

    app.get('/listado_acopios', (req, res) => {
        const query = `
            SELECT storage.name, storage.subdomain_name, storage.logo_path, storage.storage_id, client_database_connection.CLIENT_DATABASE_CONNECTION_ID
            FROM STORAGE
            JOIN client_database_connection
            WHERE storage.storage_id = client_database_connection.STORAGE_ID
            AND client_database_connection.MOBILE_ENABLED = 1
            ORDER BY storage.name ASC
        `;
    
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error en la consulta: ' + err.message);
                res.status(500).send('Error interno del servidor');
                return;
            }
    
            if (results.length > 0) {
                const resultados = results;
                res.json({ resultados });
            } else {
                res.json({ resultados: 0 });
            }
        });
    });
   

    app.listen(port, () => {
        console.log(`Servidor Express en ejecución en el puerto ${port}`);
    });
});
