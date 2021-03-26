const express = require('express');
const queries = require('../database/queries.js');
// express app
const app = express();
const cors = require('cors');

// app.use for middleware
app.use(express.json());
app.use(cors());

// get loader io
app.get('/loaderio-58f9f00483ed49daaa2e22832b630be5', (req, res) => {
  res.sendFile('/home/ubuntu/qa-db/server/loaderio-58f9f00483ed49daaa2e22832b630be5.txt');
});

// get questions route
// QA.js invoked line 19
app.get('/questions', (req, res) => {
  queries.getQuestions(req.query.product_id, req.query.page, req.query.count, (err, questions) => {
    if (err) {
      console.error(err);
      res.status(404).send(err);
    } else {
      let filteredQs = questions.filter(question => question.question_reported === false)
      let formattedResponse = {
        "product_id": req.query.product_id,
        "results": filteredQs
      };
      res.status(200).send(formattedResponse);
    }
  })
});



// Question.js invoked line 16
// aggregate version
app.get('/answers', (req, res) => {
  queries.getAnswers(req.query.question_id, req.query.page, req.query.count, (err, answers) => {
    if (err) {
      console.error(err);
      res.status(404).send(err);
    } else {
      let filtered = answers.filter(answer => answer.answer_reported === false);
      let result = {
        page: req.query.page,
        count: req.query.count,
        results: filtered
      }
      res.status(200).send(result);
    }
  });
});

// mark question as helpful
// Question.js invoked line 40
app.put('/questions/helpful/:id', (req, res) => {
  queries.markQuestionHelpful(req.params.id, (err, response) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(202).send(response);
    }
  })
});

// mark answer as helpful
// Answer.js invoked line 22
app.put('/answers/helpful/:id', (req, res) => {
  queries.markAnswerHelpful(req.params.id, (err, response) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(202).send(response);
    }
  })
});

// report question never invoked on the frontend

// report answer
// Answer.js invoked line 32
app.put('/answers/report/:id', (req, res) => {
  queries.reportAnswer(req.params.id, (err, response) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(202).send(response);
    }
  })
});

// submit question
// Modal.js invoked line 22
app.post('/questions', (req, res) => {
  queries.addQuestion(req.body, (err, response) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(201).send(response);
    }
  })
});


// submit answer
// take a look at question id in frontend
// Modal.js invoked line 30
app.post('/answers/:id', (req, res) => {
  queries.addAnswer(req.params.id, req.body, (err, response) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.status(201).send(response);
    }
  })
});


// port where server listens
const PORT = 5000;

// tell app where to listen
app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
