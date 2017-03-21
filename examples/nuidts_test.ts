'use strict';
// install typescript: `npm install -g typescript`
// compile *.ts files as `tsc file.ts`
import NUID = require("../");

// print the version
console.log(NUID.version);

// print a couple of nuids
console.log(NUID.next());
console.log(NUID.next());

// change the prefix
NUID.reset();
console.log(NUID.next());

