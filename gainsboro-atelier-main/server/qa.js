const express = require("express");
const axios = require("axios");
const {token} = require("../config.js");
const bodyParser = require("body-parser");

const apiHost = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';
const jsonParser = bodyParser.json();

const qaRouter = express.Router({mergeParams: true});

qaRouter.route('/questions')
    .get((req, res) => {
        var {product_id} = req.query;
        var url = `${apiHost}/qa/questions?product_id=${product_id}`;
        axios.get(url, {
        headers: {
            Authorization: token
        }
        })
        .then(data => res.send(data.data))
        .catch(err => res.sendStatus(500))
    })
    .post(jsonParser, (req, res) => {
        var body = req.body;

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