#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var { parse, parseAll } = require("../src/index");

function printUsage() {
  console.error(
    "Usage: dicom-sr-parser [options] <path-to.dcm> [codeValue]\n\n" +
      "Options:\n" +
      "  --all                 Return all matches (not only the first)\n" +
      "  --json                Print JSON to stdout\n" +
      "  --coding-scheme <id>  Filter by Coding Scheme Designator (0008,0102)\n" +
      "  --code-meaning <text> Filter by Code Meaning (0008,0104)\n" +
      "  -h, --help            Show this help\n\n" +
      "Default codeValue: QURE_CODE_12"
  );
}

function parseArgs(argv) {
  var opts = {
    all: false,
    json: false,
    codingScheme: null,
    codeMeaning: null,
    help: false,
  };
  var positional = [];

  for (var i = 0; i < argv.length; i++) {
    var arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      opts.help = true;
    } else if (arg === "--all") {
      opts.all = true;
    } else if (arg === "--json") {
      opts.json = true;
    } else if (arg === "--coding-scheme") {
      opts.codingScheme = argv[++i];
      if (!opts.codingScheme) {
        throw new Error("--coding-scheme requires a value");
      }
    } else if (arg === "--code-meaning") {
      opts.codeMeaning = argv[++i];
      if (!opts.codeMeaning) {
        throw new Error("--code-meaning requires a value");
      }
    } else if (arg.indexOf("-") === 0) {
      throw new Error("Unknown option: " + arg);
    } else {
      positional.push(arg);
    }
  }

  return { opts: opts, positional: positional };
}

var parsed;
try {
  parsed = parseArgs(process.argv.slice(2));
} catch (err) {
  console.error(err.message);
  printUsage();
  process.exit(1);
}

if (parsed.opts.help) {
  printUsage();
  process.exit(0);
}

var filePath = parsed.positional[0];
var codeValue = parsed.positional[1] || "QURE_CODE_12";

if (!filePath) {
  printUsage();
  process.exit(1);
}

var parseOptions = {};
if (parsed.opts.codingScheme) {
  parseOptions.codingSchemeDesignator = parsed.opts.codingScheme;
}
if (parsed.opts.codeMeaning) {
  parseOptions.codeMeaning = parsed.opts.codeMeaning;
}

var resolved = path.resolve(filePath);
var buffer;
try {
  buffer = fs.readFileSync(resolved);
} catch (err) {
  console.error("Failed to read file:", resolved, err.message);
  process.exit(1);
}

try {
  var result = parsed.opts.all
    ? parseAll(buffer, codeValue, parseOptions)
    : parse(buffer, codeValue, parseOptions);

  if (parsed.opts.json) {
    console.log(JSON.stringify(result, null, 2));
    if (!result.found) {
      process.exit(2);
    }
  } else if (parsed.opts.all) {
    if (!result.found) {
      console.log('key "' + codeValue + '" not found.');
      process.exit(2);
    }
    for (var j = 0; j < result.matches.length; j++) {
      var match = result.matches[j];
      console.log("[" + match.path.join(",") + "] " + match.text);
    }
  } else if (result.found) {
    console.log(result.text);
  } else {
    console.log('key "' + codeValue + '" not found.');
    process.exit(2);
  }
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
