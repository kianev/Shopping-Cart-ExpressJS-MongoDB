const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let Cart = require('../models/cart')
let Order = require('../models/order')

/* GET home page. */
router.get('/', function (req, res, next) {
  let successMsg = req.flash('success')[0]
  Product.find(function (err, docs) {
    let productChunks = []
    let chunkSize = 3
    for (i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize))
    }
    res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg})
  })
})

router.get('/add-to-cart/:id', function (req, res, next) {
  let productId = req.params.id
  let cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    res.redirect('/')
  })
})

router.get('/shoppingcart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shoppingcart', {products: null})
  }

  let cart = new Cart(req.session.cart)
  res.render('shop/shoppingcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
})

router.get('/checkout', isLoggedin, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shoppingcart')
  }
  let cart = new Cart(req.session.cart)
  let errMsg = req.flash('error')[0]
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg})
})

router.post('/checkout', isLoggedin, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shoppingcart')
  }
  let cart = new Cart(req.session.cart)

  let stripe = require('stripe')(
    'sk_test_78umahJuYFJQtTNTkkE3IJvZ'
  )

  stripe.charges.create({
    amount: cart.totalPrice * 100, //amount in cents
    currency: 'usd',
    source: req.body.stripeToken, // obtained with Stripe.js
    description: 'Test Charge'
  }, function (err, charge) {
    if (err) {
      req.flash('error', err.message)
      return res.redirect('/checkout')
    }

    let order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    })

    order.save(function (err, result) {
      if(err){
        console.log(err)
        return res.redirect('/checkout')
      }
      req.flash('success', 'Successfully bought products.')
      req.session.cart = null
      res.redirect('/')
    })
  })

})

module.exports = router

function isLoggedin (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url
  res.redirect('/user/signin')
}
