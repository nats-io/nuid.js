/*
 * Copyright 2016-2024 The NATS Authors
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

"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert").strict;
const NUID = require("../lib/nuid.js");

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

describe("Basics", (t) => {
  it("global nuid should not be null", function () {
    const g = NUID.nuid;
    assert.ok(g);
    g.next();
    assert.ok(g.buf);
    assert.ok(g.buf.length > 0);
    assert.ok(g.seq);
    assert.ok(g.seq > 0);
    assert.ok(g.inc);
  });

  it("duplicate nuids", () => {
    const m = {};
    // make this really big when testing, for normal runs small
    for (let i = 0; i < 10000; i++) {
      const k = NUID.next();
      assert.equal(m[k], undefined);
      m[k] = true;
    }
  });

  it("roll seq", () => {
    const a = NUID.nuid.buf.slice(12);
    NUID.next();
    const b = NUID.nuid.buf.slice(12);
    assert.equal(rangeEquals(a, b), false);
  });

  it("roll pre", () => {
    NUID.nuid.seq = 3656158440062976 + 1;
    const a = NUID.nuid.buf.slice(0, 12);
    NUID.next();
    const b = NUID.nuid.buf.slice(0, 12);
    assert.equal(rangeEquals(a, b), false);
  });

  it("reset should reset", () => {
    const a = NUID.nuid.buf.slice(0, 12);
    NUID.reset();
    const b = NUID.nuid.buf.slice(0, 12);
    assert.equal(rangeEquals(a, b), false);
  });

  it("version should match", () => {
    assert.equal(NUID.version, require("../package.json").version);
  });
});
