const path = require("path")
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const compression = require('compression')
const bodyParser = require("body-parser");
const {token} = require("../config.js");
const uploadImages = require("../imageAPI/imageAPI.js");

const upload = multer({storage: multer.diskStorage({})});
const qaRouter = require('./qa');
const jsonParser = bodyParser.json();

const app = express();
const PORT = 3000;
const apiHost = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';

// compress all requests
app.use(compression());
app.use(express.static(path.join(__dirname, "/../client/dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var options = {
  headers: {
    Authorization: token
  }
};

app.get('/overview/:product_id', (req, res) => {
  const {product_id} = req.params;
  const options = {
    headers: {Authorization: token}
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
  // console.log(sku_id);

  const url = `${apiHost}/cart`;
  const data = {
    'sku_id': sku_id
  }
  const options = {
    headers: {
      Authorization: token,
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
        Authorization: token,
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

app.use('/qa',  qaRouter);

app.post('/interactions', jsonParser, (req, res) => {
  var body = req.body;

  var url = `${apiHost}/interactions`;
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
      console.log(err)
      res.sendStatus(500)
  })
})

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/dist", 'index.html'));
});

app.listen(PORT, () => {
  console.log(`connected to port ${PORT}`);
});