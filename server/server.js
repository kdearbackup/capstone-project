const express = require('express');
const app = express();
const port = 3000;

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});