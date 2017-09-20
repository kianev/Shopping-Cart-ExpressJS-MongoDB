const express = require('express')
const router = express.Router()
let Product = require('../models/product')

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function (err, docs) {
    let productChunks = []
    let chunkSize = 3
    for (i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
  })
});

module.exports = router;
