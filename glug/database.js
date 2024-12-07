const { Client } = require('pg');

const client = new Client({
  user: 'postgres',        // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'projects_db',      // Replace with your database name
  password: '1234',    // Replace with your PostgreSQL password
  port: 5433,                   // Default PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Error connecting to the database:', err));

module.exports = client;
