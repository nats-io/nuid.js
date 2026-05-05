/*
 * Copyright 2026 The NATS Authors
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

const n = new Nuid();

Deno.bench({ name: "Nuid.next() (base62 split-int)" }, () => {
  n.next();
});

Deno.bench({ name: "global nuid.next()" }, () => {
  nuid.next();
});

Deno.bench({ name: "randomToken() (8-char base62)" }, () => {
  randomToken();
});
