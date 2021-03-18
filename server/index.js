const express = require('express');
const queries = require('../database/queries.js');
// express app
const app = express();
const cors = require('cors');

// set up router
const router = require('./routes.js');

// app.use for middleware
app.use(express.json());
app.use(cors());

// get questions route
app.get('/questions', (req, res) => {
  queries.getQuestions((err, questions) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(questions);
    }
  })
});



// port where server listens
const PORT = 5000;

// tell app where to listen
app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
