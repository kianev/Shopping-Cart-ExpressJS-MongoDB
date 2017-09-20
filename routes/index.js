const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let csrf = require('csurf')

let csrfProtection = csrf()
router.use(csrfProtection)

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

router.get('/user/signup', function (req, res, next) {
  res.render('user/signup', {csrfToken: req.csrfToken()})
})

router.post('/user/signup', function (req, res, next) {
  res.redirect('/')
})

module.exports = router;
