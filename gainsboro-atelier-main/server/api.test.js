const axios = require('axios');
const request = require('supertest');
const api = require('./server.js');
var mysql = require('mysql');
jest.setTimeout(80000);

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'SDC'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the Gosh Darn DataBase!");
});


describe('Test the questions get request', () => {
  test('GET /questions', async () => {
    const response = await request(api).get('/questions');
    expect(response.status).toBe(200);
    // response.data.forEach((questionObject) => {
    //   console.log(questionObject)
    //   expect(questionObject['Question_Id'].toBeDefined());
    // })
  })
});

// .then((res) => {
//   let oneRecord = JSON.parse(res.text).results[0];
//   let dataPoints = Object.keys(oneRecord);
//   dataPoints.forEach((lineName) => {
//     expect(oneRecord[lineName]).toBeDefined();
//   });
//   done();
// })