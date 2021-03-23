DROP DATABASE IF EXISTS qa;

CREATE DATABASE qa;

\c qa

CREATE TABLE IF NOT EXISTS questions (
  question_id BIGSERIAL,
  product_id INTEGER,
  question_body VARCHAR(250),
  question_date_written TIMESTAMP,
  asker_name VARCHAR(50),
  asker_email VARCHAR(75),
  question_reported BOOLEAN,
  question_helpful INTEGER,
  PRIMARY KEY(question_id)
 );

 CREATE TABLE IF NOT EXISTS answers (
  answer_id BIGSERIAL,
  questionId INTEGER,
  answer_body VARCHAR(250),
  answer_date_written TIMESTAMP,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(75),
  answer_reported BOOLEAN,
  answer_helpful INTEGER,
  PRIMARY KEY(answer_id),
  FOREIGN KEY(questionId)
    REFERENCES questions(question_id)
 );

 CREATE TABLE IF NOT EXISTS photos (
  photos_id BIGSERIAL,
  answerId INTEGER,
  url VARCHAR(200),
  PRIMARY KEY(id),
  FOREIGN KEY(answerId)
    REFERENCES answers(answer_id)
 );
-- jsonb_object_agg(answers.answer_id, answers.answer_body) AS answers
--  (jsonb_build_object('id', answers.answer_id, 'body', answers.answer_body,
--     'date', answers.answer_date_written, 'answerer_name', answers.answerer_name,
--     'helpfulness', answers.answer_helpful)


-- CREATE TABLE IF NOT EXISTS questions_format AS
--   SELECT questions.question_id AS question_id,
--   questions.product_id AS product_id,
--   questions.question_body AS question_body,
--   questions.question_date_written AS question_date,
--   questions.asker_name AS asker_name,
--   questions.question_helpful AS question_helpfulness,
--   questions.question_reported AS reported,
--   FROM questions
--   LEFT OUTER JOIN answers ON questions.question_id = answers.questionId
--   GROUP BY questions.question_id;

CREATE TABLE IF NOT EXISTS answers_format AS
  SELECT answers.answer_id AS answer_id,
  answers.questionid,
  answers.answer_reported,
  answers.answer_body AS body,
  answers.answer_date_written AS date,
  answers.answerer_name,
  answers.answer_helpful AS helpfulness,
  answers.answerer_email,
  jsonb_agg(jsonb_build_object('id',photos.photos_id,'url',photos.url)) AS photos FROM answers
  LEFT OUTER JOIN photos ON answers.answer_id = photos.answerId
  GROUP BY answers.answer_id
  ORDER BY answers.answer_helpful DESC;

