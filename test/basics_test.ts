/*
 * Copyright 2016-2026 The NATS Authors
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

import { Nuid, nuid, randomToken } from "../src/nuid.ts";
import {
  assert,
  assertEquals,
  assertExists,
  assertFalse,
  assertNotEquals,
} from "@std/assert";

const NUID_LEN = 22;

function isValid(s: unknown): boolean {
  if (typeof s !== "string" || s.length !== NUID_LEN) {
    return false;
  }
  for (let i = 0; i < NUID_LEN; i++) {
    const c = s.charCodeAt(i);
    if (
      !(c >= 48 && c <= 57) && // 0-9
      !(c >= 65 && c <= 90) && // A-Z
      !(c >= 97 && c <= 122) // a-z
    ) {
      return false;
    }
  }
  return true;
}

Deno.test("global nuid should not be null", () => {
  assertExists(nuid);
  nuid.next();
  assertExists(nuid.buf);
  assert(nuid.buf.length === 22);
  assertExists(nuid.seqHi);
  assertExists(nuid.seqLo);
  assertExists(nuid.inc);
});

Deno.test("nuid is 22 base62 chars", () => {
  for (let i = 0; i < 1000; i++) {
    assert(isValid(nuid.next()));
  }
});

Deno.test("duplicate nuids", () => {
  const n = new Nuid();
  const m = new Set<string>();
  for (let i = 0; i < 100000; i++) {
    const k = n.next();
    assertFalse(m.has(k), `dup at ${i}: ${k}`);
    m.add(k);
  }
});

Deno.test("roll seq", () => {
  const a = nuid.buf.slice(12);
  nuid.next();
  const b = nuid.buf.slice(12);
  assertNotEquals(a, b);
});

Deno.test("roll pre on overflow", () => {
  // Independently derive the overflow boundary from 62^10 via BigInt,
  // so a bad MAX_HI/MAX_LO in the source would be caught here.
  const MAX_SEQ = 62n ** 10n;
  const TWO32 = 1n << 32n;
  const maxHi = Number(MAX_SEQ / TWO32);
  const maxLo = Number(MAX_SEQ % TWO32);

  const n = new Nuid();
  n.next();
  n.seqHi = maxHi;
  n.seqLo = maxLo;
  n.inc = 1;
  const preBefore = n.buf.slice(0, 12);
  n.next();
  const preAfter = n.buf.slice(0, 12);
  assertNotEquals(preBefore, preAfter);
});

Deno.test("seq at exactly 62^10 must roll (off-by-one guard)", () => {
  // Last valid seq is 62^10 - 1. seq = 62^10 cannot be encoded in 10 base62
  // digits (it's "1" followed by ten "0"s) — fillSeq would drop the leading
  // 1 and emit "0000000000", aliasing seq=0. Must roll *before* fillSeq sees
  // seq == 62^10.
  const MAX_SEQ = 62n ** 10n;
  const TWO32 = 1n << 32n;
  const maxHi = Number(MAX_SEQ / TWO32);
  const maxLo = Number(MAX_SEQ % TWO32);

  const n = new Nuid();
  n.next();
  n.seqHi = maxHi;
  n.seqLo = maxLo;
  n.inc = 0;
  const preBefore = n.buf.slice(0, 12);
  n.next();
  assertNotEquals(n.buf.slice(0, 12), preBefore);
});

Deno.test("max representable seq encodes to all 'z'", () => {
  // 62^10 - 1 is the largest seq value that fits in 10 base62 digits and
  // must encode as "zzzzzzzzzz". Catches any overshoot in MAX_HI/MAX_LO
  // (which would let invalid seq values reach fillSeq and alias).
  const MAX_SEQ_MINUS_1 = 62n ** 10n - 1n;
  const TWO32 = 1n << 32n;
  const hi = Number(MAX_SEQ_MINUS_1 / TWO32);
  const lo = Number(MAX_SEQ_MINUS_1 % TWO32);

  const n = new Nuid();
  n.next();
  n.seqHi = hi;
  n.seqLo = lo;
  n.inc = 0;
  n.next();
  const suffix = new TextDecoder().decode(n.buf.slice(12));
  assertEquals(suffix, "zzzzzzzzzz");
});

Deno.test("reset should reset", () => {
  const a = nuid.buf.slice(0, 12);
  nuid.reset();
  const b = nuid.buf.slice(0, 12);
  assertNotEquals(a, b);
});

Deno.test("constructor is exported", () => {
  assertEquals(typeof Nuid, "function");
});

Deno.test("sequential ordering within prefix", () => {
  const n = new Nuid();
  const a = n.next();
  const b = n.next();
  // same prefix
  assertEquals(a.slice(0, 12), b.slice(0, 12));
  // base62 monotonic compare on the seq portion (lex order = numeric order
  // because alphabet is sorted by char code in 0-9 < A-Z < a-z)
  assert(b.slice(12) > a.slice(12), `${b} should sort after ${a}`);
});

Deno.test("isValid", () => {
  assert(isValid(nuid.next()));
  assert(isValid("0123456789ABCDEFGHIJKL"));
  assert(isValid("abcdefghijklmnopqrstuv"));
  assertFalse(isValid(""));
  assertFalse(isValid("short"));
  assertFalse(isValid("0".repeat(21)));
  assertFalse(isValid("0".repeat(23)));
  assertFalse(isValid("!".repeat(22)));
  assertFalse(isValid("0123456789ABCDEFGHIJK!"));
  // boundary chars between digit/letter ranges (`:`=58, `[`=91, `` ` ``=96)
  assertFalse(isValid("0123456789ABCDEFGHIJK:"));
  assertFalse(isValid("0123456789ABCDEFGHIJK["));
  assertFalse(isValid("0123456789ABCDEFGHIJK`"));
  assertFalse(isValid(123));
  assertFalse(isValid(null));
});

Deno.test("init produces integer seqHi/seqLo across the full random range", () => {
  // Regression: prior code did `seqLo = r - seqHi * TWO32` without flooring.
  // When Math.random() * 62^10 lands < 2^53, r can be fractional, which
  // propagates to fillSeq and yields DIGIT_CODES[non-int] = undefined,
  // coerced to 0 (NUL byte) by Uint8Array.
  const orig = Math.random;
  try {
    const probes = [
      Number.MIN_VALUE,
      1e-20,
      1e-15,
      1e-10,
      1e-6,
      0.5,
      1 - Number.EPSILON,
    ];
    for (const v of probes) {
      Math.random = () => v;
      const n = new Nuid();
      const id = n.next();
      assert(
        Number.isInteger(n.seqHi),
        `seqHi not integer for random=${v}: ${n.seqHi}`,
      );
      assert(
        Number.isInteger(n.seqLo),
        `seqLo not integer for random=${v}: ${n.seqLo}`,
      );
      assert(isValid(id), `bad id for random=${v}: ${JSON.stringify(id)}`);
    }
  } finally {
    Math.random = orig;
  }
});

Deno.test("randomToken: 8 chars in base62", () => {
  const re = /^[0-9A-Za-z]{8}$/;
  for (let i = 0; i < 1000; i++) {
    const t = randomToken();
    assert(re.test(t), `bad token: ${JSON.stringify(t)}`);
  }
});

Deno.test("randomToken: distribution looks random", () => {
  // 10k tokens; with a 62^8 space, expect ~zero duplicates and broad coverage.
  const seen = new Set<string>();
  for (let i = 0; i < 10000; i++) seen.add(randomToken());
  assert(
    seen.size > 9990,
    `expected near-unique tokens, got ${seen.size}/10000`,
  );
});

Deno.test("versions", async () => {
  const pkg = await import("../package.json", { with: { type: "json" } });
  const jsr = await import("../deno.json", { with: { type: "json" } });
  assertEquals(pkg.default.version, jsr.default.version);
});
