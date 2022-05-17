const events = require('events');
const fs = require('fs');
const readline = require('readline');

var count = 0;

(async function processLineByLine() {
  try {
    const lineThatIsRead = readline.createInterface({
      input: fs.createReadStream('Questioncsvdata.csv'),
      crlfDelay: Infinity
    });
    lineThatIsRead.on('line', (line) => {
      if (count > 0) {
        var array = line.split(',');
        console.log(count);
        // console.log(`Line from file: ${line}`);
        [id, product_id, body,date_written, asker_name, asker_email, reported, helpful] = array;
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
})();

