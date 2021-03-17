CREATE TABLE Questions (
  id BIGSERIAL,
  product_id INTEGER,
  question_body VARCHAR(250),
  question_date TIMESTAMP,
  asker_name VARCHAR(50),
  question_helpfulness INTEGER,
  reported BOOLEAN
 );


 ALTER TABLE Questions ADD CONSTRAINT Questions_pkey PRIMARY KEY (id);

 CREATE TABLE Answers (
  id BIGSERIAL,
  question_id INTEGER,
  answerer_name VARCHAR(50),
  answer_body VARCHAR(250),
  answer_date TIMESTAMP,
  helpfulness INTEGER,
  reported BOOLEAN
 );


 ALTER TABLE Answers ADD CONSTRAINT Answers_pkey PRIMARY KEY (id);

 CREATE TABLE Photos (
  id BIGSERIAL,
  answer_id INTEGER,
  url VARCHAR(100)
 );


 ALTER TABLE Photos ADD CONSTRAINT Photos_pkey PRIMARY KEY (id);

 CREATE TABLE Products (
  id BIGSERIAL
 );


 ALTER TABLE Products ADD CONSTRAINT Products_pkey PRIMARY KEY (id);

 ALTER TABLE Questions ADD CONSTRAINT Questions_product_id_fkey FOREIGN KEY (product_id) REFERENCES Products(id);
 ALTER TABLE Answers ADD CONSTRAINT Answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES Questions(id);
 ALTER TABLE Photos ADD CONSTRAINT Photos_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES Answers(id);