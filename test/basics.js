/*
 * Copyright 2016-2018 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint node: true */

/* global describe: false, before: false, after: false, it: false */
'use strict';

var nuid = require('../lib/nuid.js');
var should = require('should');

function rangeEquals(ba, bb, start, end) {
  var equal = true;
  if(start === undefined) {
    start = 0;
  }
  if(end === undefined) {
    end = ba.length;
  }
  for(var i=start; i < end; i++) {
    if(ba[i] !== bb[i]) {
      equal = false;
      break;
    }
  }
  return equal;
}

describe('Basics', function() {
  it('global nuid should not be null', function() {
    var global = nuid._global;
    should.exist(global);
    should.exist(global.buf);
    global.buf.length.should.be.greaterThan(0);
    should.exist(global.seq);
    global.seq.should.be.greaterThan(0);
    should.exist(global.inc);
  });

  it('duplicate nuids', function() {
    this.timeout(1000*60);
    var m = {};
    // make this really big when testing, for normal runs small
    for(var i=0; i < 10000; i++) {
      var k = nuid.next();
      should.not.exist(m[k]);
      m[k] = true;
    }
  });

  it('roll seq', function() {
    var a = Buffer.alloc(10);
    nuid._global.buf.copy(a, 0, 12);
    nuid.next();
    var b = Buffer.alloc(10);
    nuid._global.buf.copy(b, 0, 12);
    rangeEquals(a,b).should.be.equal(false);
  });

  it('roll pre', function() {
    nuid._global.seq = 3656158440062976 + 1;
    var a = Buffer.alloc(12);
    nuid._global.buf.copy(a,0,0,12);
    nuid.next();
    var b = Buffer.alloc(12,0,0,12);
    nuid._global.buf.copy(b);
    rangeEquals(a,b).should.be.equal(false);
  });

  it('reset should reset', function() {
    var a = Buffer.alloc(22);
    nuid._global.buf.copy(a);
    nuid.reset();
    var b = Buffer.alloc(12);
    nuid._global.buf.copy(b);

    rangeEquals(a,b,0,12).should.be.equal(false);
    rangeEquals(a,b,12).should.be.equal(false);
  });
});