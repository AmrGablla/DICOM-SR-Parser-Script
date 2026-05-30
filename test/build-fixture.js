/**
 * One-time builder for synthetic DICOM Part 10 SR fixtures (no PHI).
 * Run: node test/build-fixture.js
 */
var fs = require("fs");
var path = require("path");

var EXPLICIT_VR_LE = "1.2.840.10008.1.2.1";
var SOP_CLASS = "1.2.840.10008.5.1.4.1.1.88.11";
var SOP_INSTANCE = "1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0";
var IMPL_CLASS = "1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1";
var IMPL_VERSION = "FIXTURE01";

function padEven(value) {
  return value.length % 2 === 1 ? value + " " : value;
}

function encodeStringVR(vr, group, element, value) {
  var padded = padEven(value);
  var buf = Buffer.alloc(8 + padded.length);
  buf.writeUInt16LE(group, 0);
  buf.writeUInt16LE(element, 2);
  buf.write(vr, 4, 2, "ascii");
  buf.writeUInt16LE(padded.length, 6);
  buf.write(padded, 8, padded.length, "ascii");
  return buf;
}

function encodeUI(group, element, value) {
  var withNull = value.indexOf("\0") === -1 ? value + "\0" : value;
  var padded = withNull.length % 2 === 1 ? withNull + "\0" : withNull;
  var buf = Buffer.alloc(8 + padded.length);
  buf.writeUInt16LE(group, 0);
  buf.writeUInt16LE(element, 2);
  buf.write("UI", 4, 2, "ascii");
  buf.writeUInt16LE(padded.length, 6);
  buf.write(padded, 8, padded.length, "ascii");
  return buf;
}

function encodeUL(group, element, value) {
  var buf = Buffer.alloc(12);
  buf.writeUInt16LE(group, 0);
  buf.writeUInt16LE(element, 2);
  buf.write("UL", 4, 2, "ascii");
  buf.writeUInt16LE(4, 6);
  buf.writeUInt32LE(value, 8);
  return buf;
}

function encodeOB(group, element, bytes) {
  var buf = Buffer.alloc(12 + bytes.length);
  buf.writeUInt16LE(group, 0);
  buf.writeUInt16LE(element, 2);
  buf.write("OB", 4, 2, "ascii");
  buf.writeUInt16LE(0, 6);
  buf.writeUInt32LE(bytes.length, 8);
  bytes.copy(buf, 12);
  return buf;
}

function encodeItem(content) {
  var buf = Buffer.alloc(8 + content.length);
  buf.writeUInt16LE(0xfffe, 0);
  buf.writeUInt16LE(0xe000, 2);
  buf.writeUInt32LE(content.length, 4);
  content.copy(buf, 8);
  return buf;
}

function encodeSQ(group, element, items) {
  var itemsContent = Buffer.concat(items);
  var buf = Buffer.alloc(12 + itemsContent.length);
  buf.writeUInt16LE(group, 0);
  buf.writeUInt16LE(element, 2);
  buf.write("SQ", 4, 2, "ascii");
  buf.writeUInt16LE(0, 6);
  buf.writeUInt32LE(itemsContent.length, 8);
  itemsContent.copy(buf, 12);
  return buf;
}

function buildConceptNameCodeSequence(codeValue, scheme) {
  var itemContent = Buffer.concat([
    encodeStringVR("SH", 0x0008, 0x0100, codeValue),
    encodeStringVR("SH", 0x0008, 0x0102, scheme),
  ]);
  return encodeSQ(0x0040, 0xa043, [encodeItem(itemContent)]);
}

function buildTextContentItem(codeValue, scheme, text) {
  return encodeItem(
    Buffer.concat([
      buildConceptNameCodeSequence(codeValue, scheme),
      encodeStringVR("ST", 0x0040, 0xa160, text),
    ])
  );
}

function buildContainerItem(nestedItems) {
  return encodeItem(
    Buffer.concat([
      buildConceptNameCodeSequence("CONTAINER", "99TEST"),
      encodeSQ(0x0040, 0xa730, nestedItems),
    ])
  );
}

function buildDatasetWithContentSequence(contentSequence) {
  return Buffer.concat([
    encodeUI(0x0008, 0x0016, SOP_CLASS),
    encodeUI(0x0008, 0x0018, SOP_INSTANCE),
    encodeStringVR("CS", 0x0008, 0x0060, "SR"),
    contentSequence,
  ]);
}

function buildMinimalNestedSr() {
  var textItem = buildTextContentItem(
    "TEST_CODE_01",
    "99TEST",
    "Hello from fixture"
  );
  var containerItem = buildContainerItem([textItem]);
  return buildDatasetWithContentSequence(encodeSQ(0x0040, 0xa730, [containerItem]));
}

function buildDuplicateCodesSr() {
  var first = buildTextContentItem("DUP_CODE", "99TEST", "First duplicate");
  var second = buildTextContentItem("DUP_CODE", "99TEST", "Second duplicate");
  var nested = buildContainerItem([second]);
  var contentSequence = encodeSQ(0x0040, 0xa730, [first, nested]);
  return buildDatasetWithContentSequence(contentSequence);
}

function buildPart10(dataset) {
  var metaElements = Buffer.concat([
    encodeOB(0x0002, 0x0001, Buffer.from([0x00, 0x01])),
    encodeUI(0x0002, 0x0002, SOP_CLASS),
    encodeUI(0x0002, 0x0003, SOP_INSTANCE),
    encodeUI(0x0002, 0x0010, EXPLICIT_VR_LE),
    encodeUI(0x0002, 0x0012, IMPL_CLASS),
    encodeStringVR("SH", 0x0002, 0x0013, IMPL_VERSION),
  ]);
  var fileMeta = Buffer.concat([
    encodeUL(0x0002, 0x0000, metaElements.length),
    metaElements,
  ]);
  return Buffer.concat([Buffer.alloc(128, 0), Buffer.from("DICM"), fileMeta, dataset]);
}

var outDir = path.join(__dirname, "fixtures");
fs.mkdirSync(outDir, { recursive: true });

var fixtures = [
  ["minimal-nested-sr.dcm", buildMinimalNestedSr()],
  ["duplicate-codes-sr.dcm", buildDuplicateCodesSr()],
];

for (var f = 0; f < fixtures.length; f++) {
  var name = fixtures[f][0];
  var part10 = buildPart10(fixtures[f][1]);
  var outFile = path.join(outDir, name);
  fs.writeFileSync(outFile, part10);
  console.log("Wrote " + outFile + " (" + part10.length + " bytes)");
}
