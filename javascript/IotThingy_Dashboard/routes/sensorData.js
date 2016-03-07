var express = require('express');
var router = express.Router();
var assert = require('assert');
var controller = require('/controllers/sensorDatas')

router.get('/', function(req, res, next) {
  //TODO
  res.send('you need to specify either /sensor or /all');
});


//get everything, all data
router.get('/all', function (req, res, next) {
  //res.send('you requested all data');
  //query for EVERYTHING
  var collection = req.db.collection('testcollection');
  collection.find().toArray(function(err, array) {
    assert.equal(null, err); //verify there is no error
    res.send(array); //since this is an array, the response is sent as json
  });  
  
});

router.get('/sensor/:id', function(req, res, next) {
  var id = parseInt(req.params.id, 10);
  var collection = req.db.collection('testcollection');
  collection.find({sensor_id: id}, {_id:0, sensor_id:1, timestamp:1, temperature:1}).toArray(function(err, array) {
    assert.equal(null, err);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(array);
  })
  //res.send('you requested data for sensor id ' + id);
});

router.get('/sensor/:id/:range', function(req, res, next) {
  var id = req.params.id;
  var range = req.params.range;
  res.send('you requested data for sensor id ' + id + ' and range ' + range);
});


//router.get('/test', 
module.exports = router;