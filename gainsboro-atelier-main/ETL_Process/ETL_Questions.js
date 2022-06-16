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

var questionsHeaders = ['id', 'product_id', 'body', 'date_written', 'asker_name', 'asker_email', 'reported', 'helpful'];

async function processLineByLineQuestions(questionsCount) {
  var stream = fs.createReadStream('ETL_Process/questions.csv')
    .pipe(csv({headers: questionsHeaders, skipLines: questionsCount}))
    .on('data', async (line) => {
      const {product_id, reported, helpful, id, body, date_written, asker_name} = line

      var sqlInsertCode = `INSERT INTO questions (Question_Id, Question_Body, Question_Date, Asker_Name, Product_Id, Reported, Helpful) VALUES (${Number(id)}, "${body}", "${date_written}", "${asker_name}", ${product_id}, ${Number(reported)}, ${Number(helpful)})`;

      stream.pause()
      await connection.query(sqlInsertCode, function (error, result) {
        if (error) throw error
          console.log(`Inserted ${questionsCount} into Questions Tables`);
          questionsCount++;
          stream.resume();
      })
    })
    .on('end', () => {
      console.log(`CSV file successfully processed up to line ${questionsCount} into the Questions Table`);
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    });
}

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  processLineByLineQuestions(1);
});
