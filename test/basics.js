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
    var a = new Buffer(10);
    nuid._global.buf.copy(a,12);
    nuid.next();
    var b = new Buffer(10);
    nuid._global.buf.copy(b,12);
    rangeEquals(a,b).should.be.equal(false);
  });

  it('roll pre', function() {
    nuid._global.seq = 3656158440062976 + 1;
    var a = new Buffer(12);
    nuid._global.buf.copy(a,0,0,12);
    nuid.next();
    var b = new Buffer(12,0,0,12);
    nuid._global.buf.copy(b);
    rangeEquals(a,b).should.be.equal(false);
  });

  it('reset should reset', function() {
    var a = new Buffer(22);
    nuid._global.buf.copy(a);
    nuid.reset();
    var b = new Buffer(12);
    nuid._global.buf.copy(b);

    rangeEquals(a,b,0,12).should.be.equal(false);
    rangeEquals(a,b,12).should.be.equal(false);
  });
});