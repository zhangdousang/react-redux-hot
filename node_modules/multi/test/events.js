
var vows = require('vows');
var assert = require('assert');
var util = require('util');
var context = require('./fixtures/context');
var Multi = require('../');
var EventEmitter = require('events').EventEmitter;

var multi = new Multi({
  test: function(callback) {
    callback(null);
  },
});

var emitter = new EventEmitter();
var pre_exec = false;
var post_exec = false;
var indices = [];

multi.on('pre_exec', function() {
  pre_exec = true;
});

multi.on('post_exec', function() {
  post_exec = true;
});

multi.on('each', function(err, i, results) {
  indices.push({
    err: err,
    counter: i,
    results: results
  });
});

vows.describe('Multi Events').addBatch({
  
  'Integrity check': {
    
    'Has EventEmitter methods': function() {
      for (var method in emitter) {
        if (emitter[method] instanceof Function) {
          if (method == 'addVow') continue;
          assert.isFunction(multi[method]);
        }
      }
    }, 
    
    'Ensures unique EventEmitter per instance': function() {
      assert.isUndefined(Multi.super_);
    }
    
  }
  
}).addBatch({
  
  'Event tests': {
    
    topic: function() {
      var promise = new EventEmitter();
      
      multi.test();
      multi.test();
      multi.test();
      multi.test();
      
      multi.exec(function(err, results) {
        promise.emit('success');
      });
      
      return promise;
    },
    
    'Emits the "pre_exec" event': function() {
      assert.isTrue(pre_exec);
    },
    
    'Emits the "post_exec" event': function() {
      assert.isTrue(post_exec);
    },
    
    'Emits the "each" event': function() {
      assert.deepEqual(indices, [
        {err: null, counter: 0, results: 'OK' },
        { err: null, counter: 1, results: 'OK' },
        { err: null, counter: 2, results: 'OK' },
        { err: null, counter: 3, results: 'OK' }
      ]);
    }
    
  }
  
}).export(module);

