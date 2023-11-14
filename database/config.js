const Pool = require('pg-pool');

const pool = new Pool({
  database: process.env.NAME_DB,
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  password: process.env.PASSWORD_DB,
  port: process.env.PORT_DB,
  ssl: true
});

module.exports = { pool };

