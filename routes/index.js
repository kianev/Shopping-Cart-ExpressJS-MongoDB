const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let csrf = require('csurf')
const passport = require('passport')

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
  let messages = req.flash('error')
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/user/signup',
  passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true })
);

router.get('/user/profile', function (req, res, next) {
  res.render('user/profile')
})

module.exports = router;
