DROP DATABASE SDC;
CREATE DATABASE SDC;

USE SDC;

CREATE TABLE ProductId (
  Product_Id int NOT NULL PRIMARY KEY
);

CREATE TABLE Questions (
  Question_Id int NOT NULL,
  Question_Body varchar(255) NOT NULL,
  Question_Date varchar(25) NOT NULL,
  Asker_Name varchar(40) NOT NULL,
  Product_Id int,
  Reported BOOLEAN NOT NULL,
  Helpful int NOT NULL,
  PRIMARY KEY (Question_Id)
  -- FOREIGN KEY (Product_Id) REFERENCES ProductId(Product_Id)
);

CREATE TABLE Answers (
  Answer_Id int NOT NULL,
  Answer_Body varchar(255) NOT NULL,
  Answer_Date varchar(25) NOT NULL,
  Answerer_Name varchar(40) NOT NULL,
  Question_Id int NOT NULL,
  Helpfulness int NOT NULL,
  PRIMARY KEY (Answer_Id)
  -- FOREIGN KEY (Question_Id) REFERENCES Questions(Question_Id)
);

CREATE TABLE Photos (
  Photo_Id int,
  Photo_url varchar(175),
  Answer_Id int,
  PRIMARY KEY (Photo_Id)
  -- FOREIGN KEY (Answer_Id) REFERENCES Answers(Answer_Id)
);