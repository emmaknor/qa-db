const {Client} = require('pg')

const client = new Client ({
  user: 'emma',
  host: 'localhost',
  database: 'qa',
  password: 'password',
  port: 5432,
})

client.connect()
.then(() => console.log('connected to Postgres!'))
.catch(e => console.error(e));

// need to get all quesitons for a specified product id sorted by helpfullness score
const getQuestions = (id, cb) => {
  client.query('SELECT * FROM questions q LEFT OUTER JOIN answers a ON q.question_id = a.questionId LEFT OUTER JOIN photos p ON a.answer_id = p.answerId WHERE q.product_id = $1 ORDER BY question_helpful DESC', [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results.rows);
    }
  })
}

const getAnswers = (id, cb) => {
  client.query('SELECT * FROM answers a LEFT OUTER JOIN photos p ON a.answer_id = p.answerId WHERE a.questionId = $1 ORDER BY answer_helpful DESC', [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results.rows);
    }
  })
}

const markQuestionHelpful = (id, cb) => {
  client.query(`UPDATE questions SET question_helpful = question_helpful + 1 WHERE question_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Updated question helpfulness');
    }
  })
}

const markAnswerHelpful = (id, cb) => {
  client.query(`UPDATE answers SET answer_helpful = answer_helpful + 1 WHERE answer_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Updated answer helpfulness');
    }
  })
}

const reportAnswer = (id, cb) => {
  client.query(`UPDATE answers SET answer_reported = true WHERE answer_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Reported answer');
    }
  })
}

const addQuestion = (data, cb) => {
  const { body, name, email, product_id } = data;
  client.query('SELECT count(*) FROM questions', (err, count) => {
    if (err) {
      cb(err, null);
    } else {
      let newCount = Number(count.rows[0].count) + 1;
      client.query(`INSERT INTO questions(question_id, product_id, question_body, question_date_written, asker_name, asker_email, question_reported, question_helpful) VALUES(${newCount}, $1, $2, current_timestamp, $3, $4, false, 0)`, [product_id, body, name, email], (err, results) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, 'Added question');
        }
      })
    }
  })
}

const addAnswer = (qId, data, cb) => {
  const { body, name, email } = data;
  client.query('SELECT count(*) FROM answers', (err, count) => {
    if (err) {
      cb(err, null);
    } else {
      let newCount = Number(count.rows[0].count) + 1;
      client.query(`INSERT INTO answers(answer_id, questionId, answer_body, answer_date_written, answerer_name, answerer_email, answer_reported, answer_helpful) VALUES(${newCount}, $1, $2, current_timestamp, $3, $4, false, 0)`, [qId, body, name, email], (err, results) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, 'Added answer');
        }
      })
    }
  })
}



module.exports = {
  getQuestions,
  getAnswers,
  markQuestionHelpful,
  markAnswerHelpful,
  reportAnswer,
  addQuestion,
  addAnswer,
}
