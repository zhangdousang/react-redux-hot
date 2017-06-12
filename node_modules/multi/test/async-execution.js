
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var context = require('./fixtures/context');
var Multi = require('../');
var EventEmitter = require('events').EventEmitter;
    
vows.describe('Asynchronous execution').addBatch({
  
  'Running with successful callbacks': {
    
    topic: function() {
      
      var order = [], each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context); // parallel: false, interrupt: false

      multi.randSleep(order);
      multi.randSleep(order);
      multi.randSleep(order);
      multi.sum(2,3);

      multi.on('each', function(err, i, args) {
        each.push({
          err: err,
          counter: i,
          args: args
        });
      });
      
      multi.exec(function(err, results) {
        promise.emit('success', {err: err, results: results, order: order, each: each});
      });

      return promise;
    },

    'No errors should be reported': function(topic) {
      assert.isNull(topic.err);
    },
  
    'Results should be an array': function(topic) {
      assert.isArray(topic.results);
    },
    
    'Results.length should match method calls': function(topic) {
      assert.equal(topic.results.length, 4);
    },
    
    'Callbacks run sequentially': function(topic) {
      var expected = topic.results.slice(0,3);
      assert.deepEqual(topic.order, expected);
    },
    
    'Results are pushed in order of completion': function(topic) {
      var expected = [].concat(topic.order);
      expected.push(5);
      assert.deepEqual(expected, topic.results);
    },
    
    'The each event provides the right information': function(topic) {
      assert.equal(topic.each.length, 4);
      assert.isNull(topic.each[0].err);
      assert.isNull(topic.each[1].err);
      assert.isNull(topic.each[2].err);
      assert.isNull(topic.each[3].err);
    }

  }
}).addBatch({
  
  'Running with errors': {
    
    topic: function() {
      
      var order = [], each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context, {parallel: false, interrupt: false});
      
      multi.sleep(1);
      multi.sleep(2);
      multi.error(3);
      multi.randSleep(order);
      multi.randSleep(order);
      
      multi.on('each', function(err, i, args) {
        each.push({
          err: err,
          counter: i,
          args: args
        });
      });
      
      multi.exec(function(err, results) {
        promise.emit('success', {err: err, results: results, order: order, each: each});
      });
      
      return promise;

    },
    
    'Errors should be an array': function(topic) {
      assert.isArray(topic.err);
    },
    
    'Results should be an array': function(topic) {
      assert.isArray(topic.results);
    },
    
    'Errors.length should match method calls': function(topic) {
      assert.equal(topic.err.length, 5);
    },
    
    'Results.length should match method calls': function(topic) {
      assert.equal(topic.results.length, 5);
    },
    
    'Successful callbacks should report null as error': function(topic) {
      assert.isNull(topic.err[0]);
    },
    
    'The reported error matches the actual error': function(topic) {
      var err = topic.err[2];
      assert.isTrue(err instanceof Error && err.toString() == 'Error: The Error');
    },
    
    'Results are correctly reported': function(topic) {
      // Errored callbacks report null
      var expected = [1, 2, null].concat(topic.order);
      assert.deepEqual(expected, topic.results);
    },
    
    'The each event provides the right information': function(topic) {
      assert.equal(topic.each.length, 5);
      assert.isNull(topic.each[0].err);
      assert.isNull(topic.each[1].err);
      assert.instanceOf(topic.each[2].err, Error);
      assert.equal(topic.each[2].err.toString(), 'Error: The Error');
      assert.isNull(topic.each[3].err);
      assert.isNull(topic.each[4].err);
    }

  }
}).addBatch({

  'Running with interrupt on error': {

    topic: function() {
      
      var order = [], each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context, {parallel: false, interrupt: true});
      
      multi.sum(1,2);
      multi.randSleep(order);
      multi.randSleep(order);
      multi.error(1); // Error happens here
      multi.sum(2,2);
      multi.sum(3,2);
      
      multi.on('each', function(err, i, args) {
        each.push({
          err: err,
          counter: i,
          args: args
        });
      });
      
      multi.exec(function(err, results) {
        promise.emit('success', {err: err, results: results, order: order, each: each});
      });
      
      return promise;

    },

    'Errors should be an array': function(topic) {
      assert.isArray(topic.err);
    },

    'Results should be an array': function(topic) {
      assert.isArray(topic.results);
    },

    'Errors.length should match method calls until error': function(topic) {
      assert.equal(topic.err.length, 4); // Error happens on 4th callback
    },

    'Results.length should match method calls until error': function(topic) {
     assert.equal(topic.results.length, 4); // Error happens on 4th callback
    },

    'Last element in Errors array should be the error': function(topic) {
      var err = [].concat(topic.err).pop();
      assert.isTrue(err instanceof Error && err.toString() == 'Error: The Error');
    },
    
    'The each event provides the right information': function(topic) {
      assert.equal(topic.each.length, 3);
      assert.isNull(topic.each[0].err);
      assert.isNull(topic.each[1].err);
      assert.isNull(topic.each[2].err);
    }

  }
}).export(module);
