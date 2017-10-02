const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let csrf = require('csurf')
const passport = require('passport')

let Cart = require('../models/cart')
let Order = require('../models/order')

let csrfProtection = csrf()
router.use(csrfProtection)

router.get('/profile', isLoggedin, function (req, res, next) {
  Order.find({user: req.user}, function (err, orders) {
    if (err) {
      return res.write('Error')
    }
    let cart
    orders.forEach(function (order) {
      cart = new Cart(order.cart)
      order.items = cart.generateArray()
    })
    res.render('user/profile', {orders: orders})
  })
})

router.get('/logout', isLoggedin, function (req, res, next) {
  req.logOut()
  res.redirect('/')
})

router.use('/', notLoggedin, function (req, res, next) {
  next()
})

router.get('/signup', function (req, res, next) {
  let messages = req.flash('error')
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/signup',
  passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }), function (req, res, next) {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      res.redirect(oldUrl)
    } else {
      res.redirect('/user/profile')
    }
  })

router.get('/signin', function (req, res, next) {
  let messages = req.flash('error')
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl
    req.session.oldUrl = null
    res.redirect(oldUrl)
  } else {
    res.redirect('/user/profile')
  }
})

module.exports = router

//protecting the routs
function isLoggedin (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function notLoggedin (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
