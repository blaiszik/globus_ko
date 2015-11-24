var chai = require('chai');
var should = chai.should();
var User = require('../models/User');
var KO = require('../models/KO');
var assert = require('assert');



describe('User Model', function() {
  it('Create a new user', function(done) {
    var user = new User({
      email: 'test@gmail.com',
      password: 'password'
    });
    user.save(function(err) {
      if (err) return done(err);
      done();
    })
  });

  it('NOT Create a user with the unique email', function(done) {
    var user = new User({
      email: 'test@gmail.com',
      password: 'password'
    });
    user.save(function(err) {
      if (err) err.code.should.equal(11000);
      done();
    });
  });

  it('Find user by email', function(done) {
    User.findOne({ email: 'test@gmail.com' }, function(err, user) {
      if (err) return done(err);
      user.email.should.equal('test@gmail.com');
      done();
    });
  });

  it('Delete a user', function(done) {
    User.remove({ email: 'test@gmail.com' }, function(err) {
      if (err) return done(err);
      done();
    });
  });
});

describe('KO Model', function() {
  it('Create a new single ko', function(done) {
    var ko = new KO({
      "key":"mocha_test",
      "object":1,
      "owner":"blaiszik",
      "name":"My New KO",
      "data":[[1,2,3,4,5],[1,4,9,16,25] ],
      "tag":[{"key":"a","object":2}, {"key":"b","object":"ben"}]
    });
    ko.save(function(err) {
      if (err) return done(err);
      done();
    })
  });

    it('Create new multiple ko', function(done) {
    kos = [{
        "key":"mocha_test",
        "object":2,
        "owner":"blaiszik",
        "name":"My New KO",
        "data":[[1,2,3,4,5],[1,4,9,16,25] ],
        "tag":[{"key":"a","object":2}, {"key":"b","object":"ben"}]},
      {
        "key":"mocha_test",
        "object":3,
        "owner":"blaiszik",
        "name":"My New KO",
        "data":[[1,2,3,4,5],[1,4,9,16,25] ],
        "tag":[{"key":"a","object":5}, {"key":"b","object":5}]
     }]

    KO.collection.insert(kos, function(err, docs){
      if (err) { done(err)} 
      else {done()}
    });
  });


  it('Find all ko', function(done) {
    KO.find({}, function(err){
      if (err) return done(err);
      done();
    });
  })

  it('Update single ko', function(done) {
    KO.update({"key":"mocha_test"},{"name":"mochtest"}, function(err,details){
      if (err) return done(err);
      assert.equal(1, details.nModified);
      done();
    });
  })

   it('Update multiple ko', function(done) {
    KO.update({"key":"mocha_test"},{"name":"mochtest"},{ multi: true },  function(err,details){
      if (err) return done(err);
      assert.equal(3, details.n);
      done();
    });
  })

  it('Remove mocha_test labeled ko', function(done) {
    KO.remove({"key":"mocha_test"}, function(err){
      if (err) return done(err);
      done();
    });
  })



});
