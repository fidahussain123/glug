const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const client = require('./database'); // Import the database connection

// Set up Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the form for submitting a project
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { title, projectName, description, studentNames } = req.body;

  if (!title || !projectName || !description || !studentNames) {
    return res.status(400).send('All fields are required.');
  }

  try {
    // Insert the project data into the PostgreSQL database
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
    console.error('Error saving project to PostgreSQL:', error.message);
    res.status(500).send('An error occurred while saving project data.');
  }
});

// Display the list of projects
app.get('/projects', async (req, res) => {
  try {
    // Fetch all projects from the PostgreSQL database
    const result = await client.query('SELECT * FROM projects ORDER BY id DESC');
    const projects = result.rows; // Get rows from query result
    res.render('projects', { projects });
  } catch (error) {
    console.error('Error fetching projects from PostgreSQL:', error.message);
    res.status(500).send('An error occurred while fetching project data.');
  }
});

// Render the update project form
app.get('/update-project/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Fetch the project by ID from the PostgreSQL database
    const result = await client.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    const project = result.rows[0]; // Get the project from query result

    if (!project) {
      return res.status(404).send('Project not found.');
    }

    res.render('update-project', { project });
  } catch (error) {
    console.error('Error fetching project from PostgreSQL:', error.message);
    res.status(500).send('An error occurred while fetching project data.');
  }
});

// Handle form submission for updating a project
app.post('/update-project/:id', async (req, res) => {
  const projectId = req.params.id;
  const { title, projectName, description, studentNames } = req.body;

  if (!title || !projectName || !description || !studentNames) {
    return res.status(400).send('All fields are required.');
  }

  try {
    // Update the project data in the PostgreSQL database
    const query = `
      UPDATE projects
      SET title = $1, project_name = $2, description = $3, student_names = $4
      WHERE id = $5
    `;
    const values = [title, projectName, description, studentNames, projectId];

    await client.query(query, values); // Execute the query
    console.log('Project data updated in PostgreSQL');

    // Redirect to the projects page to display the updated list of projects
    res.redirect('/projects');
  } catch (error) {
    console.error('Error updating project in PostgreSQL:', error.message);
    res.status(500).send('An error occurred while updating project data.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
