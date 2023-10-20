const express = require('express');
const mysql = require('mysql');
const mssql = require('mssql');

const port = 3000;

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

    app.get('/getComisionista/:id/:idC', async (req, res) => {
        const { id, idC } = req.params;

        // Corregido: la consulta SQL debe incluir el valor de 'id'
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


    app.listen(port, () => {
        console.log(`Servidor Express en ejecución en el puerto ${port}`);
    });
});
