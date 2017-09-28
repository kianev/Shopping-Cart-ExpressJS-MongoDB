const express = require('express')
const router = express.Router()
let Product = require('../models/product')
let csrf = require('csurf')
const passport = require('passport')

let csrfProtection = csrf()
router.use(csrfProtection)

router.get('/profile', isLoggedin, function (req, res, next) {
  res.render('user/profile')
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
    failureFlash: true })
)

router.get('/signin', function (req, res, next) {
  let messages = req.flash('error')
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}))

module.exports = router;

//protecting the routs
function isLoggedin (req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}

function notLoggedin (req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}
