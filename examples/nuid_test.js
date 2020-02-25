#!/usr/bin/env node

'use strict'

const NUID = require('../')

// print the version
console.log(NUID.version)

// print some nuids
console.log(NUID.next())
console.log(NUID.next())
// change the prefix
NUID.reset()
console.log(NUID.next())
