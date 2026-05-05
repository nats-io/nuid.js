/*
 * Copyright 2026 The NATS Authors
 * Licensed under the Apache License, Version 2.0 (the "License");
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
