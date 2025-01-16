# Nuid.js

[![License](https://img.shields.io/badge/Licence-Apache%202.0-blue.svg)](./LICENSE)
![node](https://github.com/nats-io/nuid.js/actions/workflows/node.yml/badge.svg)
![deno](https://github.com/nats-io/nuid.js/actions/workflows/deno.yml/badge.svg)
[![coverage](https://coveralls.io/repos/github/nats-io/nuid.js/badge.svg?branch=main)](https://coveralls.io/github/nats-io/nuid.js?branch=main)
[![JSDoc](https://img.shields.io/badge/JSDoc-reference-blue)](https://nats-io.github.io/nuid.js)

[![JSR](https://jsr.io/badges/@nats-io/nuid)](https://jsr.io/@nats-io/nuid.js)
[![JSR](https://jsr.io/badges/@nats-io/nuid/score)](https://jsr.io/@nats-io/nuid.js)

[![npm](https://img.shields.io/npm/v/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid.js)
[![npm](https://img.shields.io/npm/dt/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid.js)
[![npm](https://img.shields.io/npm/dm/%40nats-io%2Fnuid)](https://www.npmjs.com/package/@nats-io/nuid.js)

A highly performant unique identifier generator for JavaScript.

## Installation

For web and deno you can use the JSR bundle:

```bash
npx jsr add @nats-io/nuid
// or
deno add @nats-io/nuid
```

```typescript
import { next, Nuid } from "jsr:@nats-io/nuid";
```

In node/bun:

```bash
npm install nuid
```

```javascript
const { next, Nuid } = require("nuid");
// or
import { next, Nuid } from "nuid";

// `nuid` is a global instance of nuid, you can use it directly
// `Nuid` is the actual class implementing the nuids, so you can also
// `new Nuid()`.
```

## Basic Usage

```javascript
// To generate a bunch of nuids:
let id = nuid.next();
id = nuid.next();
//

// To generate a new prefix:
nuid.reset();
// note that prefixes are automatically rolled whenever all
// the nuids for the specific prefix have been used.
id = nuid.next();
```

## Performance

NUID needs to be very fast to generate and be truly unique, all while being
entropy pool friendly. NUID uses 12 bytes of crypto generated data (entropy
draining), and 10 bytes of pseudo-random sequential data that increments with a
pseudo-random increment.

Total length of a NUID string is 22 bytes of base 36 ascii text, so 36^22 or
17324272922341479351919144385642496 possibilities.

## Migration

The 2.x version of the npm module support both CJS and ESM modules, an ESM only
version of the module is available via
[jsr @nats-io/nuid](https://jsr.io/@nats-io/nuid)

If you are migrating from the 1.x.x series, note that `getGlobalNuid()`,
`next()` and `reset()` and `version` property have been removed. Instead, access
the exported constant `nuid` and call `next()` or `reset()` on it as shown in
the examples above. For version information please refer to your installed
module's version information.

If you are migrating from the `js-nuid` module in npm, there should be no
changes except to the location of the import in the npm bundle:

```typescript
import { nuid } from "./node_modules/esm/index.js";
```

## Supported Node Versions

Support policy for Nodejs versions follows
[Nodejs release support](https://github.com/nodejs/Release). We will support and
build nuid on even Nodejs versions that are current or in maintenance.

## License

Unless otherwise noted, the NATS source files are distributed under the Apache
Version 2.0 license found in the LICENSE file.
