const express = require('express')
const path = require('path')
let favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const validator = require('express-validator')
const MongoStore = require('connect-mongo')(session)

const index = require('./routes/index')
const userRoutes = require('./routes/user')

const app = express()

//connect to local DB
mongoose.connect('localhost:27017/shopping')
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(validator())
app.use(cookieParser())
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseCollection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 * 1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session
  next()
})

app.use('/user', userRoutes)
app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
