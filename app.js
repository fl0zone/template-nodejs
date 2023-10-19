const express = require('express');
const sql = require('mssql');
const cors = require('cors')
const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors())

app.get('/articulos', async (req, res) => {
    try {
      // Create a connection pool
      const pool = await sql.connect({
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
    // Create a connection pool
    const pool = await sql.connect({
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

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})