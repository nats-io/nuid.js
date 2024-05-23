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

import { Nuid, nuid } from "../esm/index.mjs";
import {
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
} from "jsr:@std/assert";

Deno.test("global nuid should not be null", () => {
  assertExists(nuid);
  nuid.next();
  assertExists(nuid.buf);
  assert(nuid.buf.length > 0);
  assertExists(nuid.seq);
  assert(nuid.seq > 0);
  assertExists(nuid.inc);
});

Deno.test("duplicate nuids", () => {
  const m: Record<string, boolean> = {};
  // make this really big when testing, for normal runs small
  for (let i = 0; i < 10000; i++) {
    const k = nuid.next();
    assertEquals(m[k], undefined);
    m[k] = true;
  }
});

Deno.test("roll seq", () => {
  const a = nuid.buf.slice(12);
  nuid.next();
  const b = nuid.buf.slice(12);
  assertNotEquals(a, b);
});

Deno.test("roll pre", () => {
  nuid.seq = 3656158440062976 + 1;
  const a = nuid.buf.slice(0, 12);
  nuid.next();
  const b = nuid.buf.slice(0, 12);
  assertNotEquals(a, b);
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

Deno.test("versions", async () => {
  const pkg = await import("../package.json", {with: {type: "json"}});
  const jsr = await import("../jsr.json", {with: {type: "json"}});
  assertEquals(pkg.default.version, jsr.default.version);

})
