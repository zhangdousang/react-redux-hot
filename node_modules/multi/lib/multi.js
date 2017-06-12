
/**
  Multi
  
  Run asynchronous methods sequentially or in parallel.

  Allows methods from context to be queued and executed in asynchronously
  in order, returning the results & errors of all operations.
  
  @param {object} context
  @param {object} config
 */

var _ = require('underscore');
var slice = Array.prototype.slice;
var EventEmitter = require('events').EventEmitter;

function Multi(context, config) {
  
  var self = this;
  var restricted = ['exec', 'multi', 'constructor'];
  
  // Ensure we get all methods including those from the prototype
  var properties = _.uniq(Object.getOwnPropertyNames(context).concat(_.methods(context)));
  
  setInitialState();
  
  config = _.extend({
    interrupt: false,
    parallel: false,
    flush: true,
  }, config || {});

  Object.defineProperty(this, '__config', {
    value: config,
    writable: true,
    enumerable: false,
    configurable: true
  });

  var callback, counter, errored, errors, stack, results; // Initial state  
  
  this.exec = function(cb) {

    this.emit('pre_exec');

    callback = cb;

    if (stack.length > 0) {

      if (config.parallel) {
        
        this.promise = new EventEmitter();

        this.promise.on('finished', function() {
          var preparedArgs = setInitialState(true); // Reset state, then return
          self.emit('post_exec');
          callback.apply(self, preparedArgs);
        });

        for (var ob,i=0,len=stack.length; i < len; i++) {
          ob = stack[i];
          context[ob.caller].apply(context, ob.args);
        }

      } else {

        var first = stack[0];
        context[first.caller].apply(context, first.args);

      }
      
    } else {
      
      self.emit('post_exec');
      callback.call(context, new Error("The call stack is empty"), []);
      
    }

  }
  
  // Handles the internal async execution loop in order
  
  function resultsCallback() {
    
    var args = slice.call(arguments, 0);
    var err = args.shift();
        
    if (err) {
      if (config.interrupt === true) {
        errors.push(err);
        results.push(null);
        callback.call(self, errors, results);
        return;
      } else {
         errored = true; 
         args = null;
      }
    } else if (args.length === 0) {
      args = 'OK';
    } else if (args.length == 1) {
      args = args[0];
    }
    
    errors.push(err);
    results.push(args);
    
    self.emit('each', err, counter, args);
    
    if (config.parallel) {
      
      // Parallel

      if (++counter == stack.length) {
        self.promise.emit('finished');
      }

    } else {
      
      // Sequential
      
      if (++counter == stack.length) {
        var preparedArgs = setInitialState(true); // Reset state, then return
        self.emit('post_exec');
        callback.apply(self, preparedArgs);
      } else {
        var next = stack[counter];
        context[next.caller].apply(context, next.args);
      }

    }

  }
  
  // Queues the callback
  
  function queue(args) {
    args.push(resultsCallback);
    stack.push({caller: this.caller, args: args});
  }
  
  // Generates the queuing function
  
  function dummy(caller) {
    return function() {
      queue.call({caller: caller}, slice.call(arguments, 0));
      return self;
    }
  }
  
  // Sets the initial state of multi
  
  function setInitialState(ret) {
    
    var e, r;
    
    // Before resetting, keep a copy of args
    if (ret) {
      e = (errored ? errors : null);
      r = results;
    }
    
    // Reset runtime vars to their default state
    counter = 0;
    errored = false;
    errors = [];
    results = [];
    
    // Flush stack on first run or when config.flush is true
    if (stack == null || config.flush) stack = [];
    
    // Return prepared arguments
    if (ret) return [e, r];

  }
  
  // Create the queuing functions for the storage methods of the multi
  for (var key,i=0,len=properties.length; i < len; i++) {
    key = properties[i];
    if (context[key] instanceof Function) {
      if (restricted.indexOf(key) >= 0) continue;
      this[key] = dummy(key);
    }
  }
  
  // Get Prototype methods
  
  // Prevent conflicts with context's exec method if it exists.
  // Move original exec method from context into __exec.
  
  if (context.exec instanceof Function) {
    this.__exec = dummy('exec');
  }
  
  // We need a new event emitter per instance, can't use util.inherits()
  _.extend(this, new EventEmitter());
  
}

function setNonEnumerable(props) {
  var p, self = this;
  for (var i=0,len=props.length; i < len; i++) {
    p = props[i];
    Object.defineProperty(this, p, {
      value: self[p],
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
}

module.exports = Multi;
