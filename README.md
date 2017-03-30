# NODE NUID

[![License MIT](https://img.shields.io/npm/l/express.svg)](http://opensource.org/licenses/MIT) [![Build Status](https://travis-ci.org/nats-io/node-nuid.svg?branch=master)](http://travis-ci.org/nats-io/node-nuid) [![Coverage Status](https://coveralls.io/repos/github/nats-io/node-nuid/badge.svg?branch=master)](https://coveralls.io/github/nats-io/node-nuid?branch=master)

A highly performant unique identifier generator.

## Installation

Use the `npm` command:

	$ npm install nuid

## Basic Usage
```javascript

var NUID = require('nuid');
var nuid = NUID.next();


// Generate a new crypto/rand seeded prefix.
// Generally not needed, happens automatically.
NUID.reset();
```

## Performance
NUID needs to be very fast to generate and be truly unique, all while being entropy pool friendly.
NUID uses 12 bytes of crypto generated data (entropy draining), and 10 bytes of pseudo-random
sequential data that increments with a pseudo-random increment.

Total length of a NUID string is 22 bytes of base 36 ascii text, so 36^22 or
17324272922341479351919144385642496 possibilities.


## License

(The MIT License)

Copyright (c) 2016-2017 Apcera Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
