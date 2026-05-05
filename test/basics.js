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
const { nuid, Nuid } = require("../lib/mod.js");

function rangeEquals(ba, bb, start, end) {
  let equal = true;
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

describe("Basics", () => {
  it("constructor is available", function () {
    assert.ok(new Nuid());
  });

  it("global nuid should not be null", function () {
    assert.ok(nuid);
    nuid.next();
    assert.ok(nuid.buf);
    assert.equal(nuid.buf.length, 22);
    assert.equal(typeof nuid.seqHi, "number");
    assert.equal(typeof nuid.seqLo, "number");
    assert.ok(nuid.inc);
  });

  it("duplicate nuids", () => {
    const m = {};
    // make this really big when testing, for normal runs small
    for (let i = 0; i < 10000; i++) {
      const k = nuid.next();
      assert.equal(m[k], undefined);
      m[k] = true;
    }
  });

  it("roll seq", () => {
    const a = nuid.buf.slice(12);
    nuid.next();
    const b = nuid.buf.slice(12);
    assert.equal(rangeEquals(a, b), false);
  });

  it("roll pre", () => {
    // derive boundary from 62^10 via BigInt to catch a bad MAX_HI/MAX_LO
    const MAX_SEQ = 62n ** 10n;
    const TWO32 = 1n << 32n;
    const n = new Nuid();
    n.next();
    n.seqHi = Number(MAX_SEQ / TWO32);
    n.seqLo = Number(MAX_SEQ % TWO32);
    n.inc = 1;
    const a = n.buf.slice(0, 12);
    n.next();
    const b = n.buf.slice(0, 12);
    assert.equal(rangeEquals(a, b), false);
  });

  it("reset should reset", () => {
    const a = nuid.buf.slice(0, 12);
    nuid.reset();
    const b = nuid.buf.slice(0, 12);
    assert.equal(rangeEquals(a, b), false);
  });
});
