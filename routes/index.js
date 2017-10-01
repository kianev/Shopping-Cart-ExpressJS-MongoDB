const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let Cart = require('../models/cart')

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

router.get('/add-to-cart/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function (err, product) {
    if(err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

router.get('/shoppingcart', function (req, res, next) {
  if(!req.session.cart){
    return res.render('shop/shoppingcart', {products: null})
  }

  let cart = new Cart(req.session.cart)
  res.render('shop/shoppingcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
})

module.exports = router;
