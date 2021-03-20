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
  PRIMARY KEY(answerid),
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
