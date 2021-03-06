/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Load controllers.
 */

// var homeController = require('./controllers/home');
// var userController = require('./controllers/user');
// var apiController = require('./controllers/api');
// var pagesController = require('./controllers/pages');
// var contactController = require('./controllers/contact');
var collectionController = require('./controllers/collection');
var koController = require('./controllers/ko')

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));

app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(function(req, res, next) {
//   // CSRF protection.
//   if (_.contains(csrfExclude, req.path)) return next();
//   csrf(req, res, next);
// });
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|signin|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

app.locals.pretty = false;

/////
/**
 * Application routes.
 */

//ko
app.get('/ko/:id?', koController.find);
app.post('/ko', koController.create);
app.put('/ko/:id', koController.update);
app.delete('/ko/:id', koController.destroy);
/////

//collection
app.get('/collection/:id?', collectionController.find);
app.get('/collection/:collection_id/add/:data_type/:member_id', collectionController.add);
app.get('/collection/:id/member', collectionController.get_member);

app.post('/collection', collectionController.create);
app.put('/collection/:id', collectionController.update);
app.delete('/collection/:id', collectionController.destroy);
/////

/////


/**
 * 404 Error Handler.
 */

app.use(function(req, res) {
  res.status(404);
  res.render('404', {title: 'Error 404 - Page Not Found'});
});


/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;
