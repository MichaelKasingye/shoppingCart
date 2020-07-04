if(process.env.NODE_ENV !== 'production'){
  const dotenv = require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var pages = require('./routes/pages');
var adminpages = require('./routes/adminpages');

var app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session');

//const expressLayout = require('express-ejs-layouts');

// Set up mongoose
let mongoLdb = process.env.mongoLdb;
//let MONGOD_MLAB = process.env.mongoLdb;

//mongoose connect
mongoose
.connect(mongoLdb,
  { useUnifiedTopology: true ,
     useNewUrlParser: true })
.then(()=> console.log('Connected to Mongodb.....Michael..'))
.catch(err => console.log('failed Server to connect..'+(err))
  );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('layout','layouts/layout');

//SET global errors variable
 app.locals.errors = null;

//app.use(expressLayout);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pages);
app.use('/adminpages', adminpages);

// express middle ware messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// //Express middleware validator
// app.use(expressValidator({
//   errorFormatter: (param,msg,value)=>{
//     var namespace = param.split('.')
//     ,root = namespace.shift()
//     ,formParam = root;

//     while(namespace.length){
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return{
//       param : formParam,
//       msg    : msg,
//       value  : value
//     };
//   }
// }));

//Express middleware session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
