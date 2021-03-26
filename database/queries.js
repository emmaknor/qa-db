const {Client} = require('pg')

const client = new Client ({
  user: 'postgres',
  host: 'ec2-3-129-171-45.us-east-2.compute.amazonaws.com',
  database: 'qa',
  password: 'password',
  port: 5432,
})

client.connect()
.then(() => console.log('connected to Postgres!'))
.catch(e => console.error(e));

/*
LEFT OUTER JOIN QUESTIONS
SELECT * FROM questions q
  LEFT OUTER JOIN answers a ON q.question_id = a.questionId
  LEFT OUTER JOIN photos p ON a.answer_id = p.answerId
  WHERE q.product_id = $1 ORDER BY question_helpful
  DESC LIMIT $2
  OFFSET $3, [id, count, offset]


AGGREGATE QUESTIONS
SELECT questions.question_id AS question_id,
  questions.question_body,
  questions.question_date_written AS question_date,
  questions.asker_name,
  questions.question_helpful AS question_helpfulness,
  questions.question_reported AS reported,
  jsonb_object_agg(answers.answer_id,
    (jsonb_build_object('id', answers.answer_id, 'body', answers.answer_body,
    'date', answers.answer_date_written, 'answerer_name', answers.answerer_name,
    'helpfulness', answers.answer_helpful, 'photos', photos.url))) AS answers
  FROM questions
  LEFT OUTER JOIN answers ON questions.question_id = answers.questionId
  LEFT OUTER JOIN photos ON answers.answer_id = photos.answerId
  WHERE questions.product_id = $1
  GROUP BY questions.question_id
  ORDER BY questions.question_helpful
  DESC LIMIT $2
  OFFSET $3

    [id, count, offset]
*/

// need to get all quesitons for a specified product id sorted by helpfullness score
const getQuestions = (id, page = 0, count = 5, cb) => {
  page = page - 1;
  let offset = page * count;
  client.query(`SELECT question_id, question_body, question_date_written, asker_name, question_helpfulness, question_reported
  FROM questions WHERE product_id = $1
  ORDER BY question_helpfulness DESC
  LIMIT $2
  OFFSET $3`, [id, count, offset], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results.rows);
    }
  })
}

/*
ANSWER JOIN QUERY
SELECT * FROM answers a LEFT OUTER JOIN photos p ON a.answer_id = p.answerId WHERE a.questionId = $1 ORDER BY answer_helpful DESC LIMIT $2 OFFSET $3', [id, count, offset]

AGGREGATE
    SELECT answers.answer_id AS answer_id,
    answers.answer_body AS body,
    answers.answer_date_written AS date,
    answers.answerer_name,
    answers.answer_helpful AS helpfulness,
    jsonb_agg(DISTINCT jsonb_build_object('id',photos.photos_id,'url',photos.url)) AS photos
    FROM answers
    JOIN photos ON answer_id = answerId
    WHERE questionid = 1
    GROUP BY answers.answer_id
    ORDER BY answers.answer_helpful
    DESC LIMIT 1
    OFFSET 0;

    [id, count, offset]

ANSWER_FORMAT TABLE
  SELECT * FROM answers_format
  WHERE questionid = $1
  ORDER BY helpfulness
  DESC LIMIT $2
  OFFSET $3;

  [id, count, offset]
*/

const getAnswers = (id, page = 0, count = 5, cb) => {
  page = page - 1;
  let offset = page * count;
  client.query(
  `SELECT * FROM answers_format
  WHERE questionid = $1
  ORDER BY helpfulness DESC
  LIMIT $2
  OFFSET $3`, [id, count, offset], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results.rows);
    }
  })
}

const markQuestionHelpful = (id, cb) => {
  client.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Updated question helpfulness');
    }
  })
}

const markAnswerHelpful = (id, cb) => {
  client.query(`UPDATE answers_format SET helpfulness = helpfulness + 1 WHERE answer_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Updated answer helpfulness');
    }
  })
}

const reportAnswer = (id, cb) => {
  client.query(`UPDATE answers_format SET answer_reported = true WHERE answer_id = $1`, [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'Reported answer');
    }
  })
}

const addQuestion = (data, cb) => {
  const { body, name, email, product_id } = data;

  client.query(`INSERT INTO questions(product_id,
    question_body,
    question_date_written,
    asker_name,
    asker_email,
    question_reported,
    question_helpfulness)
    VALUES($1,
      $2,
      current_timestamp,
      $3,
      $4,
      false,
      0)`, [product_id, body, name, email], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      if (err) {
        cb(err, null);
      } else {
        cb(null, 'Added question');
      }
    }
  })
}

const addAnswer = (qId, data, cb) => {
  const { body, name, email } = data;
  const photos = '[ {"id": "null", "url": "null" } ]';
  client.query('SELECT count(*) FROM answers_format', (err, count) => {
    if (err) {
      cb(err, null);
    } else {
      let newCount = Number(count.rows[0].count) + 1;
      client.query(`INSERT INTO answers_format(answer_id,
        questionId,
        answer_reported,
        body,
        date,
        answerer_name,
        helpfulness,
        answerer_email,
        photos) VALUES(${newCount},
          $1,
          false,
          $2,
          current_timestamp,
          $3,
          0,
          $4,
          $5)`, [qId, body, name, email, photos], (err, results) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, 'Added answer');
        }
      })
    }
  })
}

// SELECT pg_catalog.setval(pg_get_serial_sequence('questions', 'question_id'), (SELECT MAX(question_id) FROM questions)+1);

module.exports = {
  getQuestions,
  getAnswers,
  markQuestionHelpful,
  markAnswerHelpful,
  reportAnswer,
  addQuestion,
  addAnswer,
}
