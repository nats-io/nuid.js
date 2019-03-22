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


/* global require: false, describe: false, it: false */

'use strict';

const nuid = require('../lib/nuid.js');
const should = require('should');

function rangeEquals(ba, bb, start, end) {
    var equal = true;
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = ba.length;
    }
    for (let i = start; i < end; i++) {
        if (ba[i] !== bb[i]) {
            equal = false;
            break;
        }
    }
    return equal;
}

describe('Basics', function() {
    it('global nuid should not be null', function() {
        var global = nuid.getGlobalNuid();
        should.exist(global);
        should.exist(global.buf);
        global.buf.length.should.be.greaterThan(0);
        should.exist(global.seq);
        global.seq.should.be.greaterThan(0);
        should.exist(global.inc);
    });

    it('duplicate nuids', function() {
        var m = {};
        // make this really big when testing, for normal runs small
        for (var i = 0; i < 10000; i++) {
            var k = nuid.next();
            should.not.exist(m[k]);
            m[k] = true;
        }
    }).timeout(1000*60);

    it('roll seq', function() {
        const a = Buffer.alloc(10);
        nuid.getGlobalNuid().buf.copy(a, 0, 12);
        nuid.next();
        const b = Buffer.alloc(10);
        nuid.getGlobalNuid().buf.copy(b, 0, 12);
        rangeEquals(a, b).should.be.equal(false);
    });

    it('roll pre', function() {
        nuid.getGlobalNuid().seq = 3656158440062976 + 1;
        const a = Buffer.alloc(12);
        nuid.getGlobalNuid().buf.copy(a, 0, 0, 12);
        nuid.next();
        const b = Buffer.alloc(12);
        nuid.getGlobalNuid().buf.copy(b, 0, 0, 12);
        rangeEquals(a, b).should.be.equal(false);
    });

    it('reset should reset', function() {
        const a = Buffer.alloc(22);
        nuid.getGlobalNuid().buf.copy(a);
        nuid.reset();
        const b = Buffer.alloc(12);
        nuid.getGlobalNuid().buf.copy(b);

        rangeEquals(a, b, 0, 12).should.be.equal(false);
        rangeEquals(a, b, 12).should.be.equal(false);
    });
});
