
var util = require('util');
var slice = Array.prototype.slice;

// Exporting an instance containing both methods added after instantiation,
// and methods inherited from the prototype.

// The multi object should detect and wrap these methods. If not, the tests
// will not complete successfully because the prototype methods were not detected.

function TestObject() {
  
  // Callback returning a result

  this.sum = function(a, b, callback) {
    callback(null, a+b);
  }
  
  // Callback returning error
  
  this.error = function(timeout, callback) {
    setTimeout(function() {
      callback(new Error('The Error'), null);
    }, timeout);
  }
  
}

TestObject.prototype.sleep = function(delay, callback) {
  setTimeout(function() {
    callback(null, delay);
  }, delay);
}

TestObject.prototype.randSleep = function(arr, callback) {
  var t = Math.ceil(Math.random()*10);
  if (util.isArray(arr)) arr.push(t);
  setTimeout(function() {
    callback(null, t);
  }, t);
},

module.exports = new TestObject();