const axios = require('axios');
const request = require('supertest');
const api = require('./server.js');
var mysql = require('mysql');
jest.setTimeout(80000);

var randomNumber = Math.floor(1000000*Math.random());

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
  var response = null;
  var data = null;
  test('GET /questions', async () => {
    response = await request(api).get('/questions');
    expect(response.status).toBe(200);
    data = JSON.parse(response.text);
    console.log(data[0]['AnswerData'][0]);
  })
  test('GET /questions', async () => {
    expect(typeof data[0]).toBe('object');
  })
  test('GET /questions', async () => {
    expect(data[0]['Question_Id']).toBe(253159);
  })
});

describe('Testing that a new question can be added', () => {

  test('POST /questions', async () => {
    const payload = {
      'email': 'a.almomani96@gmail.com',
      'body': 'Testing the info!',
      'name': 'Ahmad Almomani',
      'product_id': randomNumber
    };
    await request(api).post('/questions').send(payload);
    var returnedData = null;
    var queryStatement = `Select * from Questions where Product_Id = ${randomNumber}`;
    await connection.query(queryStatement, function (err, data) {
      expect(data[data.length - 1]['Product_Id']).toBe(randomNumber)
    })
  });
  test('POST /questions', async () => {
    const payload = {
      'email': 'a.almomani96@gmail.com',
      'body': 'Testing the info!',
      'name': 'Ahmad Almomani',
      'product_id': 123456789
    };
    await request(api).post('/questions').send(payload);
    var returnedData = null;
    var queryStatement = `Select * from Questions where Product_Id = ${12345678}`;
    await connection.query(queryStatement, function (err, data) {
      expect(data[data.length - 1]['Reported']).toBe(0)
    })
  });
  test('POST /questions', async () => {
    var queryStatement = `Select * from Questions where Product_Id = ${randomNumber}`;
    await connection.query(queryStatement, function (err, data) {
      expect(data[data.length - 1]['Asker_Name']).toBe('Ahmad Almomani')
    })
  });
  test('POST /questions', async () => {
    var queryStatement = `Select * from Questions where Product_Id = ${randomNumber}`;
    await connection.query(queryStatement, function (err, data) {
      expect(data[data.length - 1]['Question_Body']).toBe('Testing the info!')
    })
  });
});



describe('Testing that an answer that is helpful can be liked', () => {
  var payload = {
    answer_Id: 494185,
    question_Id: 253159
  }
  var queryStatement = `Select Helpfulness from Answers where Answer_Id = ${payload.answer_Id} AND Question_Id = ${payload.question_Id}`;
  test('POST /answers/answer_id/helpful', async () => {
    var helpful = null;
    await connection.query(queryStatement, function (err, data) {
      helpful = data[0]['Helpfulness'];
      console.log(helpful, ',sdkjflskdj')
      expect(typeof helpful).toBe('number')
    })
  });

  test('POST /answers/answer_id/helpful', async () => {

    await request(api).post('/answers/answer_id/helpful').send(payload);
    connection.query(queryStatement, function (err, data) {
      var helpful2 = data[0]['Helpfulness'];
      console.log(helpful, helpful2)
      expect(helpful).toBe(helpful2 - 1);
    })
  });


});