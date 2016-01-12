var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require("socket.io");
var cors = require("cors");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var models = require('./server/models/index');

//expose socket.io
var io = socket_io();
app.io = io;

io.on('connection', function (socket) {
  //users
  socket.on('loadUsers', function () {
    models.Users.findAll({}).then(function (users) {
      io.emit('loadUsers', users);
    });
  });
  socket.on('loadUser', function (name) {
    models.Users.find({
      where: {
        name: name
      }
    }).then(function (user) {
      io.emit('loadUser', user);
    });
  });
  socket.on('createUser', function (name, password) {
    models.Users.create({
      jwt: null,
      name: name,
      password: password
    }).then(function (user) {
      io.emit('createUser', user);
    });
  });
  socket.on('deleteUser', function (id) {
    models.Users.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (user) {
      io.emit('deleteUser', user)
    });
  });

  //questions
  socket.on('loadQuestions', function () {
    models.Questions.findAll({}).then(function (questions) {
      io.emit('loadQuestions', questions);
    });
  });
  socket.on('loadQuestion', function (id) {
    models.Questions.find({
      where: {
        id: id
      }
    }).then(function (question) {
      io.emit('loadQuestion', question);
    });
  });
  socket.on('createQuestion', function (UserId, title, content) {
    models.Questions.create({
      UserId: UserId,
      title: title,
      content: content
    }).then(function (question) {
      io.emit('createQuestion', question);
    });
  });
  socket.on('deleteQuestion', function (id) {
    models.Questions.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (question) {
      io.emit('deleteQuestion', question)
    });
  });

  //answers
  socket.on('loadAnswers', function () {
    models.Answers.findAll({}).then(function (answers) {
      io.emit('loadAnswers', answers);
    });
  });
  socket.on('loadAnswer', function (id) {
    models.Answers.find({
      where: {
        id: id
      }
    }).then(function (answer) {
      io.emit('loadAnswer', answer);
    });
  });
  socket.on('createQuestion', function (UserId, QuestionId, title, content) {
    models.Answers.create({
      UserId: UserId,
      QuestionId: QuestionId,
      title: title,
      content: content
    }).then(function (answer) {
      io.emit('createAnswer', answer);
    });
  });
  socket.on('deleteQuestion', function (id) {
    models.Answers.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (answer) {
      io.emit('deleteAnswer', answer)
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
