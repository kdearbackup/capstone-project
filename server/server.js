const express = require('express');
const bodyParser = require('body-parser');
const { pythonShell } = require ('python-shell');
const app = express();
const port = 3000;

// middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// New route for predicting salary
app.get('/predict-salary', (req,res) => {
  res.send('Hello World for Salary!')
  const {jobRole, location } = req.body;
  

    //Options for PythonShell
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: '/python/linear_regression.py',
      args: [jobRole, location]
    };

    pythonShell.run('linear_regression.py', options, (err, results) => {
      if (err){
        console.error('Error executing Python script:', err);
        return res.status(500).json({ error: 'Internal Server Error, details: err.message'});
      }

      const predictedSalary = results[0];
      res.json({ predictedSalary});
    });
})
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});