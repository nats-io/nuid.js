# Nuid.js

[![License](https://img.shields.io/badge/Licence-Apache%202.0-blue.svg)](./LICENSE)
![node](https://github.com/nats-io/nuid.js/actions/workflows/node.yml/badge.svg)
![deno](https://github.com/nats-io/nuid.js/actions/workflows/deno.yml/badge.svg)
[![coverage](https://coveralls.io/repos/github/nats-io/nuid.js/badge.svg?branch=main)](https://coveralls.io/github/nats-io/nuid.js?branch=main)
[![JSDoc](https://img.shields.io/badge/JSDoc-reference-blue)](https://nats-io.github.io/nuid.js)

[![JSR](https://jsr.io/badges/@nats-io/nuid)](https://jsr.io/@nats-io/nuid)
[![JSR](https://jsr.io/badges/@nats-io/nuid/score)](https://jsr.io/@nats-io/nuid)

[![npm](https://img.shields.io/npm/v/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid)
[![npm](https://img.shields.io/npm/dt/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid)
[![npm](https://img.shields.io/npm/dm/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid)

A highly performant unique identifier generator for JavaScript.

## Installation

Deno (via JSR):

```bash
deno add jsr:@nats-io/nuid
```

```typescript
import { Nuid, nuid } from "jsr:@nats-io/nuid";
```

Node / Bun (via npm):

```bash
npm install @nats-io/nuid
```

```javascript
// `nuid` is a shared global instance — call `next()` on it directly.
// `Nuid` is the class — use `new Nuid()` for an isolated instance.
const { nuid, Nuid } = require("@nats-io/nuid");
// or
import { Nuid, nuid } from "@nats-io/nuid";
```

## Basic Usage

```javascript
// To generate a bunch of nuids:
let id = nuid.next();
id = nuid.next();
//

// To generate a new prefix:
nuid.reset();
// the prefix is also re-randomized automatically when the sequence
// counter overflows (i.e. reaches 62^10).
id = nuid.next();
```

## Format

A NUID is 22 base-62 ASCII characters from the alphabet `0-9A-Za-z`:

- **12-char prefix** — drawn from `crypto.getRandomValues` (entropy-friendly:
  one draw per instance, not per id). Per-prefix space is 62^12 ≈ 3.2×10^21.
- **10-char sequence** — starts at a pseudo-random offset and advances by a
  pseudo-random increment (33..332) on each `next()`. Per-prefix sequence space
  is 62^10 ≈ 8.4×10^17 ids before the prefix is re-randomized.

Total identifier space is 62^22 ≈ 2.7×10^39.

Output format matches the Go `nats-io/nuid` reference — same alphabet, same
length — so JS-generated nuids look the same as Go-generated ones.

## Migration

From 2.x to 3.x: nothing to do. The public API is unchanged. Output is still 22
chars; now uses the full base-62 alphabet (`0-9A-Za-z`) matching the Go
`nats-io/nuid` reference.

The 3.x version of the npm module supports both CJS and ESM. An ESM-only version
of the module is available via
[jsr @nats-io/nuid](https://jsr.io/@nats-io/nuid).

## Supported Node Versions

Minimum supported Node.js version is set in `package.json` (`engines.node`),
currently **>= 22**. The version policy tracks
[Node.js release support](https://github.com/nodejs/Release): supported floor
moves up as older LTS lines reach end-of-life. CI runs against the latest
current release.

## License

Unless otherwise noted, the NATS source files are distributed under the Apache
Version 2.0 license found in the LICENSE file.
