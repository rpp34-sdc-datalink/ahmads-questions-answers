const events = require('events');
const fs = require('fs');
const readline = require('readline');
const csv = require('csv-parser');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "SDC"
});
// var unix_timestamp = n;
// date = new Date(unix_timestamp * 1000);

var answersHeaders = ['id', 'question_id', 'body', 'date_written', 'answerer_name', 'answerer_email', 'reported', 'helpful'];
async function processLineByLineAnswers(answersCount) {
  try {
    var stream = fs.createReadStream('ETL_Process/answers.csv')
    .pipe(csv({headers: answersHeaders, skipLines: answersCount}))
    .on('data', async (line) => {
      const {id, reported, helpful, question_id, body, date_written, answerer_name, answerer_email} = line;

        var sqlInsertCode = `INSERT INTO Answers (Answer_Id, Answer_Body, Answer_Date, Answerer_Name, Question_Id, Reported, Helpfulness, Answerer_Email) VALUES (${Number(id)}, "${body}", "${date_written}", "${answerer_name}", ${Number(question_id)},  ${Number(reported)}, ${Number(helpful)}, "${answerer_email}")`
        stream.pause()
        await connection.query(sqlInsertCode, function (error, result) {
          if (error) throw error;
          console.log(`Inserted ${answersCount} into Answer Table`);
          answersCount++;
          stream.resume();
        })
      })
      .on('end', () => {
        console.log(`CSV file successfully processed up to line ${answersCount} into the Answers Table`);
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
      });
  } catch (err) {
    console.error(err);
  }
};

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  processLineByLineAnswers(1);
});
