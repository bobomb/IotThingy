var express = require('express');
var router = express.Router();

//get everything, all data
router.get('/', function(req, res, next) {
  //TODO
  res.send('you need to specify either /sensor or /all');
});

router.get('/all', function (req, res, next) {
  res.send('you requested all data');
});

router.get('/sensor/:id', function(req, res, next) {
  var id = req.params.id;
  res.send('you requested data for sensor id ' + id);
});

router.get('/sensor/:id/:range', function(req, res, next) {
  var id = req.params.id;
  var range = req.params.range;
  res.send('you requested data for sensor id ' + id + ' and range ' + range);
});

module.exports = router;