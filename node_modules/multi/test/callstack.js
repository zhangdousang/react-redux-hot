
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var context = require('./fixtures/context');
var Multi = require('../');
var EventEmitter = require('events').EventEmitter;

vows.describe('Call Stack Operations').addBatch({
  
  'Queue Flushing Functionality': {
    
    topic: function() {
      var promise = new EventEmitter(),
          multi = new Multi(context, {flush: false});
      var out = [];
      multi.sum(1,2);
      multi.sum(3,4);
      multi.exec(function(err, results) {
        // First round
        out.push(err || results);
        
        multi.exec(function(e1, r1) {
          // Second Round
          out.push(e1 || r1);
          
          // Set parallel & flush to true
          multi.__config.parallel = true;
          multi.__config.flush = true;
          
          multi.exec(function(e2, r2) {
            
            // Third round (parallel)
            out.push(e2 || r2);
            
            // At this point, the call stack is empty
            multi.exec(function(e3, r3) {
              // Fourth round (error, due to empty call stack)
              out.push(e3 || r3);
              
              // Return promise
              promise.emit('success', out);
              
            });
            
          });
          
        });
        
      });
      return promise;
    },
    
    'Keeps the call stack on asynchronous execution': function(topic) {
      var expected = [3,7];
      assert.deepEqual(topic[0], expected);
      assert.deepEqual(topic[1], expected);
    },
    
    'Keeps the call stack on parallel execution': function(topic) {
      var subject = topic[2],
          expected = [3,7];
      assert.isArray(subject);
      assert.strictEqual(subject.length, 2);
      assert.isTrue(expected.indexOf(subject[0]) >= 0);
      assert.isTrue(expected.indexOf(subject[1]) >= 0);
    },
    
    'Returns an error on empty call stack': function(topic) {
      var err = topic[3];
      assert.isTrue(err instanceof Error);
    }
    
  }
  
}).export(module);