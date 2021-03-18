DROP DATABASE IF EXISTS qa;

CREATE DATABASE qa;

\c qa

CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL,
  product_id INTEGER,
  body VARCHAR(250),
  date_written TIMESTAMP,
  asker_name VARCHAR(50),
  asker_email VARCHAR(75),
  reported BOOLEAN,
  helpful INTEGER,
  PRIMARY KEY(id)
 );

 CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL,
  question_id INTEGER,
  body VARCHAR(250),
  date_written TIMESTAMP,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(75),
  reported BOOLEAN,
  helpful INTEGER,
  PRIMARY KEY(id),
  FOREIGN KEY(question_id)
    REFERENCES questions(id)
 );

 CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL,
  answer_id INTEGER,
  url VARCHAR(200),
  PRIMARY KEY(id),
  FOREIGN KEY(answer_id)
    REFERENCES answers(id)
 );
