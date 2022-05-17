const events = require('events');
const fs = require('fs');
const readline = require('readline');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "SDC"
});

var count = 0;

// var unix_timestamp = n;
// date = new Date(unix_timestamp * 1000);

async function processLineByLine() {
  try {
    const lineThatIsRead = readline.createInterface({
      input: fs.createReadStream('Questioncsvdata.csv'),
      crlfDelay: Infinity
    });
    lineThatIsRead.on('line', (line) => {
      if (count > 0 && count < 5) {
        console.log(line)
        var array = line.split(',');
        // console.log(count);
        // console.log(`Line from file: ${line}`);
        // [id, product_id, body,date_written, asker_name, asker_email, reported, helpful] = array;
        // console.log(array);
        // insertInto(array, function () {
        //   return;
        // })
        // console.log(array)
        [id, product_id, body, date_written, asker_name, asker_email, reported, helpful] = array;
        id = Number(id);
        product_id = Number(product_id);
        console.log(helpful, 'kasldfkjslkfjsdlkjf', array)
        helpful = Number(helpful);
        reported = 1;

        var sqlInsertCode = `INSERT INTO questions (Question_Id, Question_Body, Question_Date, Asker_Name, Product_Id, Reported, Helpful) VALUES (${id}, ${body}, ${date_written}, ${asker_name}, ${product_id}, ${reported}, ${helpful})`
          connection.query(sqlInsertCode, function (err, result) {
            if (err) throw err;
            console.log('inserted');
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
  processLineByLine()
})