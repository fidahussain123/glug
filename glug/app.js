const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const client = require('./database');  // Import the database connection

// Set up Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Serve the form for submitting a project
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { title, projectName, description, studentNames } = req.body;

  try {
    // Insert the project data into PostgreSQL database
    const query = `
      INSERT INTO projects (title, project_name, description, student_names)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [title, projectName, description, studentNames];

    await client.query(query, values); // Execute the query
    console.log('Project data saved to PostgreSQL');
    
    // Redirect to the projects page to display the updated list of projects
    res.redirect('/projects');
  } catch (error) {
    console.error('Error saving project to PostgreSQL:', error);
    res.status(500).send('Error saving project data');
  }
});

// Display the list of projects
app.get('/projects', async (req, res) => {
  try {
    // Fetch all projects from the PostgreSQL database
    const result = await client.query('SELECT * FROM projects');
    const projects = result.rows; // Get rows from query result
    res.render('projects', { projects });
  } catch (error) {
    console.error('Error fetching projects from PostgreSQL:', error);
    res.status(500).send('Error fetching project data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
