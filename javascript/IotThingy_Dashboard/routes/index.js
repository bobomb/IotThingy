var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//GET sensor test page
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});

router.get('/dashboard/:id', function(req, res, next) {
  res.render('dashboard', {sensorData: sensorData})
});

//router.get('dashboard/:id/:range', function(req, res, next) {
//  res.render('dashbard', {sensorData: sensorData, range:  0
//});
module.exports = router;