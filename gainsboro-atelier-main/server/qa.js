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


qaRouter.route('/questions')
    .get((req, res) => {
        var {product_id} = req.query;
        var url = `${apiHost}/qa/questions?product_id=${product_id}`;
        // axios.get(url, {
        // headers: {
        //     Authorization: token
        // }
        var queryStatement = `Select * from Questions where Product_Id = ${product_id}`;
        connection.query(queryStatement, function (error, data){
            if (error) res.sendStatus(500);
            res.send(data.data);
        })
        // })
        // .then(data => {
        //     res.send(data.data)}
        //     )
        // .catch(err => res.sendStatus(500))
    })
    .post(jsonParser, (req, res) => {
        var body = req.body;
        console.log(body)
        var url = `${apiHost}/qa/questions`;
        axios.post(url, body, {
            'content-type': 'application/json',
            headers: {
                Authorization: token
            }
        })
        .then(data => {
            res.send(data.data)
        })
        .catch(err => {
            res.sendStatus(500)
        })
    })




qaRouter.route('/questions/:question_id/helpful')
    .post(jsonParser, (req, res) => {
        var {question_id} = req.params;
        var body = req.body;

        var url = `${apiHost}/qa/questions/${question_id}/helpful`;
        axios.put(url, body, {
            'content-type': 'application/json',
            headers: {
                Authorization: token
            }
        })
        .then(data => {
            console.log('hi')
            res.send(data.data)
        })
        .catch(err => {
            res.sendStatus(500)
        })
    })

qaRouter.route('/answers/:answer_id/helpful')
    .post(jsonParser, (req, res) => {
        var {answer_id} = req.params;
        var body = req.body;

        var url = `${apiHost}/qa/answers/${answer_id}/helpful`;
        axios.put(url, body, {
            'content-type': 'application/json',
            headers: {
                Authorization: token
            }
        })
        .then(data => {
            res.send(data.data)
        })
        .catch(err => {
            res.sendStatus(500)
        })
    })

    qaRouter.route('/answers/:answer_id/report')
        .post(jsonParser, (req, res) => {
            var {answer_id} = req.params;
            var body = req.body;

            var url = `${apiHost}/qa/answers/${answer_id}/report`;
            axios.put(url, body, {
                'content-type': 'application/json',
                headers: {
                    Authorization: token
                }
            })
            .then(data => {
                res.send(data.data)
            })
            .catch(err => {
                res.sendStatus(500)
            })
    })


module.exports = qaRouter;