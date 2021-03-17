const {Client} = require('pg')

const client = new Client ({
  user: 'root',
  host: 'localhost',
  database: 'qa',
  password: 'password',
  port: 5432,
})

client.connect()
.then(() => console.log('connected to Postgres!'))
.catch(e => console.error(e));

const getQuestions = (req, res) => {
  client.query('SELECT * FROM questions', (err, results) => {
    if (error) {
      console.error(error);
    } else {
      res.status(200).send(results);
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
  client.query(`UPDATE qa SET helpfulness = ${question_id} WHERE id = ${id}`, [helpfulness], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results);
    }
  })
}


module.exports = {
  getQuestions,
  addQuestion,
  updateQHelpfulness,
}
