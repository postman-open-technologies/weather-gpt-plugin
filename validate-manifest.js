#!/usr/bin/env node

const fs = require("fs");
const yaml = require("yaml");

const { parser } = require('@exodus/schemasafe');

const parse = parser(yaml.parse(fs.readFileSync('./plugin-schema.json', "utf8")), { includeErrors: true, allErrors: true, mode: 'lax', requireStringValidation: false });

console.log(parse(JSON.stringify(yaml.parse(fs.readFileSync(process.argv[2], "utf8")))));