const express = require("express");
const axios = require("axios");
const {token} = require("../config.js");
const bodyParser = require("body-parser");
var mysql = require('mysql');

const apiHost = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
const jsonParser = bodyParser.json();

const qaRouter = express.Router({mergeParams: true});


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


// qaRouter.route('/questions')
//     .get((req, res) => {
//         var {product_id} = req.query;
//         var url = `${apiHost}/qa/questions?product_id=${product_id}`;
//         axios.get(url, {
//         headers: {
//             Authorization: token
//         }
//         })
//         .then(data => {
//             // console.log(data.data)
//             res.send(data.data)}
//             )
//         .catch(err => res.sendStatus(500))
//     })
//     .post(jsonParser, (req, res) => {
//         var body = req.body;
//         console.log(body)
//         var url = `${apiHost}/qa/questions`;
//         axios.post(url, body, {
//             'content-type': 'application/json',
//             headers: {
//                 Authorization: token
//             }
//         })
//         .then(data => {
//             res.send(data.data)
//         })
//         .catch(err => {
//             res.sendStatus(500)
//         })
//     })

var getAnswerQuestionData = function(answersQuery, data, index, dataLength, callback) {
    connection.query(answersQuery, function (error, answerData) {
        if (error) res.sendStats(500);
        data[index]['AnswerData'] = answerData;
        if (dataLength === index) {
            console.log('SUCCESS');
            callback(null, data);
        }
    })
}

qaRouter.route('/questions')
    .get((req, res) => {
        var {product_id} = req.query;
        console.log('data')
        var url = `${apiHost}/qa/questions?product_id=${product_id}`;
        var queryStatement = `Select * from Questions where Product_Id = ${product_id}`;
        connection.query(queryStatement, function (error, data){
            if (error) res.sendStatus(500);
            var dataLength = data.length - 1;
            const loop = async () => {
                var count = 0;
                for (const index of data) {
                    var question_Id = data[count]['Question_Id'];
                    var answersQuery = `Select * from Answers where Question_Id = ${question_Id}`
                    await getAnswerQuestionData(answersQuery, data, count, dataLength, function (error, data) {
                        res.send(data);
                    });
                    count++;
                }
            }
            loop()
        })
    })
    .post(jsonParser, (req, res) => {
        const {body, name, email, product_id} = req.body;
        var date =  Date.now();
        var questionInsert = `SELECT MAX (Question_Id) from Questions`;
        connection.query(questionInsert, function (error, data){
            if (error) res.sendStatus(500);
            const data2 = data['MAX(Question_Id)'];
            var questionMax = data[0]['MAX (Question_Id)'] + 1;
            // console.log(questionMax);
            var sqlInsertCode = `INSERT INTO questions (Question_Id, Question_Body, Question_Date, Asker_Name, Product_Id, Reported, Helpful) VALUES (${questionMax}, "${body}", "${date}", "${name}", ${product_id}, ${0}, ${0})`;
            connection.query(sqlInsertCode, function(err, data) {
                if (err) res.sendStatus(500);
                console.log('done')
                res.send('data')

            })
        })
    })



module.exports = qaRouter;