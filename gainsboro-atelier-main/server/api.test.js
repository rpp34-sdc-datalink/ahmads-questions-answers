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
  var response = null;
  var data = null;
  test('GET /questions', async () => {
    response = await request(api).get('/questions');
    expect(response.status).toBe(200);
    data = JSON.parse(response.text);
  })

  test('GET /questions', async () => {
    expect(typeof data[0]).toBe('object');
  })

  test('GET /questions', async () => {
    expect(data[0]['Question_Id']).toBe(253159);
  })
});
