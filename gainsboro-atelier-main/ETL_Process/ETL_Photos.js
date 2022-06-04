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


var answers_Photos_Headers = ['id', 'answer_id', 'body'];

async function processLineByLineAnswers_Photos(answers_Photos_Count) {
  try {
    var stream = fs.createReadStream('ETL_Process/answers_photos.csv')
    .pipe(csv({headers: answers_Photos_Headers, skipLines: answers_Photos_Count}))
    .on('data', async (line) => {

      const {id, answer_id, body} = line;

      var sqlInsertCode = `INSERT INTO Photos (Photo_Id, Photo_url, Question_Id) VALUES (${Number(id)}, "${body}", ${Number(answer_id)})`

      stream.pause()
      await connection.query(sqlInsertCode, function (error, result) {
        if (error)  throw error
        console.log(`Inserted ${answers_Photos_Count} into Photos Table`);
        answers_Photos_Count++;
        stream.resume();
      })
    })
    .on('end', () => {
      console.log(`CSV file successfully processed up to line ${answers_Photos_Count} into the Answer Photos Table`);
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    })
    } catch (err) {
      console.error(err);
    }
};

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  processLineByLineAnswers_Photos(1);
});
