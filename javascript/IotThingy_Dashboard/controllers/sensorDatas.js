var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var mongodb;

//connect to mongodb
const connectURI = util.format('mongodb://%s:%s/%s', dbConfig.host, dbConfig.port, dbConfig.db);
MongoClient.connect(connectURI, function(err, db) {
  assert.equal(null, err); //verify we didn't get an error or fail
  console.log("Connected correctly to server %s", connectURI);
  mongodb = db;
});

exports.getAll = function(){
  var collection = mongodb.collection(dbConfig.collection);
  
  return collection.find().toArray(function(err, array) {
    assert.equal(null, err); //verify there is no error
    return array;
  });
};