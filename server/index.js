const express = require('express');
const queries = require('../database/queries.js');
// express app
const app = express();
const cors = require('cors');

// app.use for middleware
app.use(express.json());
app.use(cors());

// initial test route
app.get('/', (req, res) => {
  res.send('hi from the server!');
});

// port where server listens
const PORT = 5000;

// tell app where to listen
app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
