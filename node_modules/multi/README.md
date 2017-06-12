# Multi [![Build Status](https://secure.travis-ci.org/derdesign/multi.png)](http://travis-ci.org/derdesign/multi)

Asynchronous execution library.


## Features

- Run callbacks asynchronously in sequence or in parallel
- Wraps around an object with asynchronous methods
- Stops execution if error encountered
- Reusable call stack if needed



## Installation

To install multi:

    npm install multi

Install from git repository:

    git clone https://github.com/derdesign/multi.git
    
Running tests:

    make test


    
## Usage

Multi creates a wrapper object containing the same methods as the original object. The wrapped methods can then be run either
in sequence or in parallel, by providing the proper options to the `Multi::exec` method.

The following example wraps the `fs` module in a Multi object, to perform async file operations:

```javascript
var fs = require('fs');
var Multi = require('multi');
  
var mfs = new Multi(fs);

mfs.readFile('assets/hello.html', 'utf-8');
mfs.readdir('assets/');
mfs.readFile('assets/style.css', 'utf-8');
mfs.lstat('assets/text.txt');

mfs.exec(function(err, results) {
  console.log(err || results);
});
```

## API

### Multi(options)
Multi constructor. Receives an options object. Available options are:

- **parallel**: Determines if the methods will run in parallel. Defaults to `false`

- **interrupt**: Interrupts execution if an error is encountered. Defaults to `false`

- **flush**: Clears the call stack after running `exec`. Defaults to `true`

### multi.exec(callback)
Runs the wrapper methods asynchronously using the configuration passed to the multi constructor. The callback has a
signature of `(err, results)`. If an error occurs, `err` will be an array with the errors from the execution stack.

The `results` object is an array containing the arguments provided to callbacks in the execution stack.



## Events

**pre_exec**: Emitted before running the call stack

**post_exec**: Emitted upon completion, before calling the `exec` callback



## License

`multi` is [MIT Licensed](https://github.com/derdesign/multi/blob/master/LICENSE)