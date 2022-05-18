const events = require('events');
const fs = require('fs');
const readline = require('readline');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "SDC"
});

// var unix_timestamp = n;
// date = new Date(unix_timestamp * 1000);
async function processLineByLineQuestions(count, lineCount) {
  try {
    const lineThatIsRead = readline.createInterface({
      input: fs.createReadStream('Questioncsvdata.csv'),
      crlfDelay: Infinity
    });
    lineThatIsRead.on('line', (line) => {
      if (count > 0 && count < 5) {
        var quotes = 0;
        var array = [];
        var currentWord = '';
        for (var i = 0; i < line.length; i++) {
          if (line[i] ==='"') quotes++;
          if (line[i] !== ',') currentWord += line[i];
          if (line[i] === ',' && quotes % 2 === 1) currentWord += line[i];
          if (line[i] === ',' && quotes % 2 === 0) {
            array.push(currentWord);
            currentWord = '';
          }
        }
        array.push(currentWord);

        [id, product_id, body, date_written, asker_name, asker_email, reported, helpful] = array;
        reported = 1;
        var sqlInsertCode = `INSERT INTO questions (Question_Id, Question_Body, Question_Date, Asker_Name, Product_Id, Reported, Helpful) VALUES (${Number(id)}, ${body},${date_written}, ${asker_name}, ${Number(product_id)}, ${Number(reported)}, ${Number(helpful)})`
          connection.query(sqlInsertCode, function (err, result) {
            lineCount++;
            if (err) throw err;
            console.log('Inserted line ', lineCount,  'into the Questions Table');
          })
      }
      count++;
    });

    await events.once(lineThatIsRead, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  } catch (err) {
    console.error(err);
  }
};

async function processLineByLineAnswers(count, lineCount) {
  try {
    const lineThatIsRead = readline.createInterface({
      input: fs.createReadStream('answer.csv'),
      crlfDelay: Infinity
    });
    lineThatIsRead.on('line', (line) => {
      if (count > 0 && count < 5) {
        var quotes = 0;
        var array = [];
        var currentWord = '';
        for (var i = 0; i < line.length; i++) {
          if (line[i] ==='"') quotes++;
          if (line[i] !== ',') currentWord += line[i];
          if (line[i] === ',' && quotes % 2 === 1) currentWord += line[i];
          if (line[i] === ',' && quotes % 2 === 0) {
            array.push(currentWord);
            currentWord = '';
          }
        }
        array.push(currentWord);
        [id, question_Id, body, date_written, answerer_name, answerer_email, reported, helpfulness] = array;
        console.log(array.length, array)
        // console.log(answerer_name,'laksjdflksjflksjdflkjs', array)

        var sqlInsertCode = `INSERT INTO Answers (Answer_Id, Answer_Body, Answer_Date, Answerer_Name, Question_Id, Helpfulness) VALUES (${Number(id)}, ${body}, ${date_written}, ${answerer_name}, ${Number(question_Id)}, ${Number(helpfulness)})`
          connection.query(sqlInsertCode, function (err, result) {
            lineCount++;
            if (err) throw err;
            console.log('Inserted line ', lineCount, 'into the Answers Table');
          })
      }
      count++;
    });

    await events.once(lineThatIsRead, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  } catch (err) {
    console.error(err);
  }
};


connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  processLineByLineQuestions(0, 1);
  processLineByLineAnswers(0, 1);
})