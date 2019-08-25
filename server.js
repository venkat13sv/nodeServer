var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
var issues_FILE = path.join(__dirname, 'cases.json');
app.set('port', (process.env.PORT || 3001));
app.use(cors());// Include this line where you find a list of use statementsbut it should be
app.use('/', express.static(path.join(__dirname, '.')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/cases', function(req, res) {
  fs.readFile(issues_FILE, function(err, data) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.description = "Internal Error";
      res.send(err);
    }
    else {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(JSON.parse(data));
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
  console.log('Directory test'+ issues_FILE);
});
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
