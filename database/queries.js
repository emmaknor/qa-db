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
      console.log('ANSWERS: ', results.rows);
      cb(null, results.rows);
    }
  })
}

const getAnswers = (id, cb) => {
  client.query('SELECT * FROM answers WHERE question_id = $1 ORDER BY helpful DESC', [id], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      console.log(results.rows);
      cb(null, results.rows);
    }
  })
}

const addQuestion = (req, res) => {
  const { body, name, email, product_id } = req.body;
  client.query('INSERT INTO questions (body, name, email, product_id)', [body, name, email, product_id], (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.status(201).send(results);
    }
  })
}

const updateQHelpfulness = (req, res) => {
  const { question_id, helpfulness } = req.params.body;
  client.query(`UPDATE qa SET helpfulness = ${helpfulness} WHERE id = ${id}`, [helpfulness], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results);
    }
  })
}


module.exports = {
  getQuestions,
  getAnswers,
  addQuestion,
  updateQHelpfulness,
}
