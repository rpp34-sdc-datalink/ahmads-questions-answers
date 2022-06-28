const path = require("path")
const express = require("express");
require('dotenv').config()
const multer = require("multer");
const axios = require("axios");
const compression = require('compression')
const bodyParser = require("body-parser");
var token = null;
var removedToken = null
const uploadImages = require("../imageAPI/imageAPI.js");

const upload = multer({storage: multer.diskStorage({})});
const qaRouter = require('./qa');
const jsonParser = bodyParser.json();

const app = express();
const PORT = 3001;
const apiHost = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';

// compress all requests
app.use(compression());
app.use(express.static(path.join(__dirname, "/../client/dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var mysql = require('mysql');

var pass = process.env.MYSQL_PASSWORD;
console.log(pass)
var connection = mysql.createConnection({
  host     : '127.0. 0.1',
  user     : 'ahmad',
  password : process.env.MYSQL_PASSWORD,
  database : 'SDC'
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected to the Gosh Darn DataBase!");
});


var options = {
  headers: {
    none: removedToken
  }
};

app.get('/overview/:product_id', (req, res) => {
  const {product_id} = req.params;
  const options = {
    headers: {none: removedToken}
  };
    axios.get(`${apiHost}/products/${product_id}/styles/`, options)
    .then(async ({data: {results: styleData}}) => {
      const {data: generalData} = await axios.get(`${apiHost}/products/${product_id}`, options);
      const data = { styleData, ...generalData};
      res.send(data)
    })
    .catch(err => res.sendStatus(500))
})

app.post('/cart', (req, res)=>{
  const {sku_id} = req.body;

  const url = `${apiHost}/cart`;
  const data = {
    'sku_id': sku_id
  }
  const options = {
    headers: {
      none: removedToken,
    }
  };

  axios.post(url, data, options)
  .then(()=>{
    return axios.get(url, options);
  })
  .then(({data})=>{
    res.status(201).send(data);
  })
  .catch((err)=>{
      // console.log('post cart err: ');
      res.sendStatus(500);
  })
})

app.get('/products/:product_id/related', (req, res) => {

  var url = `${apiHost}/products/${req.params.product_id}/related`;
  axios.get(url, options)
  .then(({data}) => {
    var productInfo = data.map(productId => {
      var infoURL = `${apiHost}/products/${productId}`;
      return axios.get(infoURL, options)
      .then(({data}) => {
        const {id, name, category, features} = data;
        var productInfo = {id, name, category, features};
        return productInfo;
      })
    })
    return Promise.all(productInfo);
  })
  .then(productInfo => {
    var defaultStyles = productInfo.map(info => {
      var styleURL = `${apiHost}/products/${info.id}/styles`;
      return axios.get(styleURL, options)
      .then(({data}) => {
        var styles = data.results;
        var defaultStyle = styles.reduce((defaultStyle, style) => defaultStyle = style['default?'] ? {...defaultStyle, ...style} : {...defaultStyle}, {});
        if (!Object.keys(defaultStyle).length) {
          defaultStyle = styles[0];
        }
        info.defaultStyle = defaultStyle;
        return info;
      })
    })
    return Promise.all(defaultStyles);
  })
  .then(defaultStyles => {
    var relatedProducts = defaultStyles.map(defaultStyle => {
      var metaURL = `${apiHost}/reviews/meta?product_id=${defaultStyle.id}`;
      return axios.get(metaURL, options)
      .then(({data}) => {
        var ratings = data.ratings;
        defaultStyle.ratings = ratings;
        return defaultStyle;
      });
    })
    return Promise.all(relatedProducts)
  })
  .then(relatedProducts => res.send(relatedProducts))
  .catch(err => res.sendStatus(500))
})

app.get('/reviews', (req, res) => {
  var {product_id, sort, count} = req.query;
  var url = `${apiHost}/reviews?product_id=${product_id}&sort=${sort}&count=${count}`;
  axios.get(url, options)
  .then(data => {
    res.send(data.data.results)
  })
  .catch(err => res.sendStatus(500))
})


app.put('/reviews/:review_id/helpful', (req, res) => {
  var url = `${apiHost}/reviews/${req.params["review_id"]}/helpful`;
  axios.put(url, {}, options)
  .then(data => {
    res.sendStatus(data.status);
  })
  .catch(err => res.sendStatus(500))
})

app.get('/reviews/meta/:product_id', (req, res) => {
  var url = `${apiHost}/reviews/meta?product_id=${req.params.product_id}`;
  axios.get(url, options)
  .then(data => {
    res.send(data.data)
  })
  .catch(err => res.sendStatus(500))
})

app.post('/reviews', upload.array("images"), (req, res) => {
  const {product_id, rating, summary, body, recommend, name, email, characteristics} = req.body;
  uploadImages(req.files)
  .then(data => {
    var photos = data;
    var formData = {
      product_id: JSON.parse(product_id),
      rating: JSON.parse(rating),
      summary,
      body,
      recommend: JSON.parse(recommend),
      name,
      email,
      characteristics: JSON.parse(characteristics),
      photos
    }
    var config = {
      headers: {
        none: removedToken,
        'content-type': 'application/json'
      }
    }
    return axios.post(`${apiHost}/reviews`, formData, config)
  })
  .then(data => {
    res.send(data.data)
  })
  .catch(err => {
    res.sendStatus(500);
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  var url = `${apiHost}/reviews/${req.params["review_id"]}/report`;
  axios.put(url, {}, options)
  .then(data => {
    res.sendStatus(data.status);
  })
  .catch(err => res.sendStatus(500))
})

// app.use('/qa',  qaRouter);

var getAnswerQuestionData = function(answersQuery, data, index, dataLength, callback) {
  connection.query(answersQuery, function (error, answerData) {
      if (error) res.sendStatus(500);
      data[index]['AnswerData'] = answerData;
      if (dataLength === index) {
          callback(null, data);
      }
  })
}

app.route('/questions')
  .get((req, res) => {
    // var {product_id} = req.query;
    product_id = Math.floor(1000 * Math.random()) + 71968;
    // if (product_id === null || product_id === undefined) product_id = 71968;
    var url = `${apiHost}/questions?product_id=${product_id}`;
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
                    console.log(data)
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
      var sqlInsertCode = `INSERT INTO questions (Question_Id, Question_Body, Question_Date, Asker_Name, Product_Id, Reported, Helpful) VALUES (${questionMax}, "${body}", "${date}", "${name}", ${product_id}, ${0}, ${0})`;
        connection.query(sqlInsertCode, function(err, data) {
            if (err) res.sendStatus(500);
            res.send('data')
        })
    })
})





app.post('/answers/answer_id/helpful', (req, res) => {
    var answer_id = req.body.answer_Id;
    var question_id = req.body.question_Id;
    var queryStatement = `UPDATE Answers set Helpfulness = Helpfulness + 1 where Answer_Id = ${answer_id} AND Question_Id = ${question_id}`;
    connection.query(queryStatement, function (error, data){
        if (error) res.sendStatus(500);
        res.send('Successful Helpful Answer Update');
    })
})

app.post('/answers/answer_id/report', (req, res) => {
    var answer_id = req.body.answer_Id;
    var question_id = req.body.question_Id;
    var queryStatement = `UPDATE Answers set Reported = 1 where Answer_Id = ${answer_id} AND Question_Id = ${question_id}`;
    connection.query(queryStatement, function (error, data){
      if (error) {
        res.sendStatus(500);
      } else {
        res.send('Successful Reported Answer Update');
      }
  })
})

app.post('/questions/question_id/helpful', (req, res) => {
  var question_id = req.body.question_Id;
  var product_id = req.body.product_Id;
  var queryStatement = `UPDATE Questions set Helpful = Helpful + 1 where Product_Id = ${product_id} AND question_id = ${question_id}`;
  connection.query(queryStatement, function (error, data){
      if (error) {
        res.sendStatus(500);
      } else {
        res.send(data);
      }
  })
})


app.post('/interactions', jsonParser, (req, res) => {
  var body = req.body;
  var url = `${apiHost}/interactions`;
  axios.post(url, body, {
      'content-type': 'application/json',
      headers: {
          none: removedToken
      }
  })
  .then(data => {
      res.sendStatus(200).send(data.data)
  })
  .catch(err => {
      res.sendStatus(500)
  })
})

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/dist", 'index.html'));
});

app.listen(PORT, () => {
  // console.log(`connected to port ${PORT}`);
});

module.exports = app;


