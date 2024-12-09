

const { Pool } = require('pg');

// Configure the PostgreSQL client
const pool = new Pool({
  user: 'postgres',       // Replace with your PostgreSQL username
  host: 'localhost',           // Database host (default is localhost)
  database: 'projects_db',      // Your database name
  password: '1234',   // Your PostgreSQL password
  port: 5432                   // Default PostgreSQL port
});

module.exports = pool;
