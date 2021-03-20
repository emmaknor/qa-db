const express = require('express');
const queries = require('../database/queries.js');
// express app
const app = express();
const cors = require('cors');

// app.use for middleware
app.use(express.json());
app.use(cors());

// get questions route
// QA.js invoked line 19
app.get('/questions/:id', (req, res) => {
  queries.getQuestions(req.params.id, (err, questions) => {
    if (err) {
      console.error(err);
      res.status(404).send(err);
    } else {
      let formattedResponse = {
        "product_id": req.params.id,
        "results": []
      };
     let qArr = [];
      questions.forEach((question, i) => {
        if (!qArr.includes(question.question_id)) {
          qArr.push(question.question_id);
          // create obj for each question
          if (question.question_reported !== true) {
            let qObj = {
              "question_id": question.question_id,
              "question_body": question.question_body,
              "question_date": question.question_date_written,
              "asker_name": question.asker_name,
              "question_helpfulness": question.question_helpful,
              "reported": question.question_reported
            };
            if (question.answer_reported !== true && question.answer_reported !== null) {
              qObj.answers = {};
              qObj.answers[question.answer_id] = {
                "id": question.answer_id,
                "body": question.answer_body,
                "answerer_name": question.answerer_name,
                "helpfulness": question.answer_helpful
              };
            }
            if (question.url !== null) {
              qObj.answers[question.answer_id].photos = [question.url]
            }
            formattedResponse.results.push(qObj);
          }
        // otherwise question exists in formatted response & we just want to add answer to correct q obj
        } else {
          // iterate through formattedResponse results arr
          for (let i = 0; i < formattedResponse.results.length; i++) {
            // check if question is already in arr
            if (formattedResponse.results[i].question_id === question.question_id && question.answer_reported !== true) {
              let answerObj = {
                "id": question.answer_id,
                "body": question.answer_body,
                "answerer_name": question.answerer_name,
                "helpfulness": question.answer_helpful
              }
              if (question.url !== null) {
                answerObj.photos = [question.url];
              }
              formattedResponse.results[i].answers[question.answer_id] = answerObj;
            }
          }
        }
      });
      res.status(200).send(formattedResponse);
    }
  })
});

// Question.js invoked line 16
app.get('/answers/:id', (req, res) => {
  queries.getAnswers(req.params.id, (err, answers) => {
    if (err) {
      console.error(err);
      res.status(404).send(err);
    } else {
      let answerResponse = {
        "question": req.params.id,
        "page": 0,
        "count": answers.length,
        "results": []
      };
      answers.forEach((ans, i) => {
        if (ans.answer_reported !== true) {
          let ansObj = {
            "answer_id": ans.answer_id,
            "body": ans.answer_body,
            "date": ans.answer_date_written,
            "answerer_name": ans.answerer_name,
            "helpfulness": ans.answer_helpful,
          }
          if (ans.url !== null) {
            ansObj.photos = [ans.url];
          }
          answerResponse.results.push(ansObj);
        }
      })
      res.status(200).send(answerResponse);
    }
  })
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
