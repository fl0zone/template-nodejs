const { Pool } = require('pg');

const pool = new Pool({
  user: 'fl0user',
  host: 'ep-sweet-bread-02408629.us-east-2.aws.neon.tech',
  database: 'kumanima',
  password: 'G1g4rzTWNPfk',
  port: 5432, // Puerto predeterminado de PostgreSQL
});

module.exports = pool;