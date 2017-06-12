
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var context = require('./fixtures/context');
var Multi = require('../');
var EventEmitter = require('events').EventEmitter;
    
var sortFunc = function(a,b) { return a-b; }
    
vows.describe('Parallel Execution').addBatch({
  
  'Running with successful callbacks': {
    
    topic: function() {
      var order = [], each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context, {parallel: true});

      multi.randSleep(order);
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
        promise.emit('success', {err: err, results: results, order: order, each: each})
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
      assert.equal(topic.results.length, 3);
    },    
    
    'Callbacks run simultaneously': function(topic) {
      var o = topic.order,
          r = topic.results;
      var cond1 = (r.indexOf(o[0]) >= 0),
          cond2 = (r.indexOf(o[1]) >= 0),
          cond3 = (r.indexOf(o[2]) >= 0);
      assert.isTrue(cond1 && cond2 && cond3);
    },
    
    'Results are pushed in order of completion': function(topic) {
      var expectedOrder = [].concat(topic.order).sort(sortFunc);
      assert.deepEqual(expectedOrder.sort(), topic.results.sort());
    },
    
    'The each event provides the right information': function(topic) {
      // assert.equal(topic.each.length, 3);
      // assert.isNull(topic.each[0].err);
      // assert.isNull(topic.each[1].err);
      // assert.isNull(topic.each[2].err);
    }
    
  }
}).addBatch({
  
  'Running with errors': {
    
    topic: function() {
      
      var order = [], each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context, {parallel: true});
      
      multi.randSleep(order);
      multi.error(5);
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
      assert.equal(topic.err.length, 3);
    },
    
    'Results.length should match method calls': function(topic) {
      assert.equal(topic.results.length, 3);
    },
    
    'Successful callbacks should report null as error': function(topic) {
      var errors = topic.err, counter = 0;
      for (var i=0; i < errors.length; i++) {
        if (errors[i] === null) counter++;
      }
      assert.equal(counter, 2);
    },
    
    'The reported error matches the actual error': function(topic) {
      var errors = [].concat(topic.err);
      for (var err,i=0; i < errors.length; i++) {
        err = errors[i];
        if (err instanceof Error) break;
      }
      assert.isTrue(err instanceof Error && err.toString() == 'Error: The Error');
    },
    
    'Results are correctly reported': function(topic) {
      var expected = [null].concat(topic.order),
          r = topic.results;
      var cond1 = expected.indexOf(r[0]) >= 0,
          cond2 = expected.indexOf(r[1]) >= 0,
          cond3 = expected.indexOf(r[2]) >= 0;
      assert.isTrue(cond1 && cond2 && cond3);
    },
    
    'The each event provides the right information': function(topic) {
      var each = topic.each;
      assert.equal(each.length, 3);
      for (var i=0,errCount=0,len=each.length; i < len; i++) {
        if (each[i].err) errCount++;
      }
      assert.equal(errCount, 1);
    }

  }
}).addBatch({
  
  'Running with interrupt on error': {
    
    topic: function() {
      
      var each = [];
      var promise = new EventEmitter();
      var multi = new Multi(context, {parallel: true, interrupt: true});
          
      // Callbacks run simultaneously, but 3 & 2
      multi.sleep(50);
      multi.sleep(40);
      multi.error(30); // Breaks here
      multi.sleep(20); // Runs second
      multi.sleep(10); // Runs first
      
      multi.on('each', function(err, i, args) {
        each.push({
          err: err,
          counter: i,
          args: args
        });
      });
      
      multi.exec(function(err, results) {
        promise.emit('success', {err: err, results: results, each: each})
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
      if (topic.err.length !== 3) console.log(topic);
      assert.equal(topic.err.length, 3);
    },
    
    'Results.length should match method calls until error': function(topic) {
     assert.notEqual(topic.results.length, 5);
    },
    
    'Last element in Errors array should be the error': function(topic) {
      var err = topic.err[2];
      assert.isTrue(err instanceof Error && err.toString() == 'Error: The Error');
    },
    
    'The each event provides the right information': function(topic) {
      assert.equal(topic.each.length, 2);
      for (var i=0,len=topic.each.length; i < len; i++) {
        assert.isNull(topic.each[i].err);
      }
    }
    
  }
}).export(module);