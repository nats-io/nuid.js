# NODE NUID

[![license](https://img.shields.io/github/license/nats-io/node-nuid.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![npm](https://img.shields.io/npm/v/nuid.svg)](https://www.npmjs.com/package/nuid)
[![npm](https://img.shields.io/npm/dt/nuid.svg)](https://www.npmjs.com/package/nuid)
[![npm](https://img.shields.io/npm/dm/nuid.svg)](https://www.npmjs.com/package/nuid)

A highly performant unique identifier generator.

## Installation

Use the `npm` command:

    $ npm install nuid

## Basic Usage

Import the library for node/bun:

```bash
npm install nuid
```

For web and deno you can also:

```bash
npx jsr add @nats-io/nuid
```

Reference the library in your code. If using you can `import` or `require` the
npm nuid library supports both Common JS and ESM:

```javascript
const { nuid, Nuid, next, reset } = require("nuid");
// or
import { next, Nuid, nuid, reset } from "nuid";

// `nuid` is a global instance of nuid, you can look at it directly
// or you can use `next()` and `reset()` to mutate it if you would like.
// `Nuid` is the actual class implementing the nuids, so you can also
// `new Nuid()`.
```

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

The 2.x version of the npm module support both CJS and ESM modules, an EMS only
version of the module is available via
[jsr @nats-io/nuid](https://jsr.io/@nats-io/nuid)

If you are migrating from the 1.x.x series, note that `getGlobalNuid()` has been
replaced with the constant `nuid` as shown in the examples above.

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
