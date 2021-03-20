const express = require('express');
const queries = require('../database/queries.js');
// express app
const app = express();
const cors = require('cors');

// app.use for middleware
app.use(express.json());
app.use(cors());

// get questions route
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
          let qObj = {
            "question_id": question.question_id,
            "question_body": question.question_body,
            "question_date": question.question_date_written,
            "asker_name": question.asker_name,
            "question_helpfulness": question.question_helpful,
            "reported": question.question_reported,
            "answers": {}
          };
          qObj.answers[question.answer_id] = {
            "id": question.answer_id,
            "body": question.answer_body,
            "answerer_name": question.answerer_name,
            "helpfulness": question.answer_helpful,
            "photos": []
          };
          qObj.answers[question.answer_id].photos.push(question.url);
          formattedResponse.results.push(qObj);
        // otherwise question exists in formatted response & we just want to add answer to correct q obj
        } else {
          // iterate through formattedResponse results arr
          for (let i = 0; i < formattedResponse.results.length; i++) {
            // check if question is already in arr
            if (formattedResponse.results[i].question_id === question.question_id) {
              console.log('its a match!!')
              let answerObj = {
                "id": question.answer_id,
                "body": question.answer_body,
                "answerer_name": question.answerer_name,
                "helpfulness": question.answer_helpful,
                "photos": []
              }
              answerObj.photos.push(question.url);
              formattedResponse.results[i].answers[question.answer_id] = answerObj;
            }
          }
        }
      });
      res.status(200).send(formattedResponse);
    }
  })
});

/*

FOR 18855
CURRENT QUESTION DATA RESPONSE
[
    {
        "id": "66366",
        "product_id": 18855,
        "body": "Quis sed dolorem.",
        "date_written": "2018-11-22T07:00:00.000Z",
        "asker_name": "Luther_Greenholt96",
        "asker_email": "Beth_Runte@yahoo.com",
        "reported": false,
        "helpful": 18
    },
    {
        "id": "66365",
        "product_id": 18855,
        "body": "Itaque temporibus architecto enim blanditiis sequi facilis fuga.",
        "date_written": "2018-08-04T06:00:00.000Z",
        "asker_name": "Mervin.Heidenreich",
        "asker_email": "Zula.Stamm@yahoo.com",
        "reported": false,
        "helpful": 12
    }
]

*/

/*
DESIRED QUESTION DATA RESPONSE
{
    "product_id": "18855",
    "results": [
        {
            "question_id": 121519,
            "question_body": "Fugit officia nostrum maxime voluptatem.",
            "question_date": "2020-04-16T00:00:00.000Z",
            "asker_name": "Kiel.Mayer",
            "question_helpfulness": 27,
            "reported": false,
            "answers": {
                "1150109": {
                    "id": 1150109,
                    "body": "Est maiores sapiente error dolor quo repellendus dicta.",
                    "date": "2020-05-07T00:00:00.000Z",
                    "answerer_name": "Zack_Ortiz6",
                    "helpfulness": 1,
                    "photos": [
                        "https://images.unsplash.com/photo-1517720359744-6d12f8a09b10?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
                        "https://images.unsplash.com/photo-1470282312847-28b943046dc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1652&q=80"
                    ]
                },
                "1150110": {
                    "id": 1150110,
                    "body": "Quia et ex quos.",
                    "date": "2020-03-25T00:00:00.000Z",
                    "answerer_name": "Noel25",
                    "helpfulness": 11,
                    "photos": []
                },
*/

/*
CURRENT ANSWERS RESPONSE - for each q id:
 [
  {
    id: '66366',
    product_id: 18855,
    body: 'Quis sed dolorem.',
    date_written: 2018-11-22T07:00:00.000Z,
    asker_name: 'Luther_Greenholt96',
    asker_email: 'Beth_Runte@yahoo.com',
    reported: false,
    helpful: 18
  },
  {
    id: '66365',
    product_id: 18855,
    body: 'Itaque temporibus architecto enim blanditiis sequi facilis fuga.',
    date_written: 2018-08-04T06:00:00.000Z,
    asker_name: 'Mervin.Heidenreich',
    asker_email: 'Zula.Stamm@yahoo.com',
    reported: false,
    helpful: 12
  }
]
*/

/*
DESIRED ANSWERS RESPONSE:
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
*/




// port where server listens
const PORT = 5000;

// tell app where to listen
app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
