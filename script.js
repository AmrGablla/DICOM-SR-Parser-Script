var dicomParser = require("dicom-parser");

var fs = require("fs");
var filePath = process.argv[2];
var targetKey = process.argv[3] || "QURE_CODE_12";
var dicomFileAsBuffer = fs.readFileSync(filePath);

try {
  var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);
  const json = dicomParser.explicitDataSetToJS(dataSet);
  const impressionText = findImpressionText(json, targetKey);

  if (impressionText !== null) {
    console.log(impressionText);
  } else {
    console.log(`key "${targetKey}" not found.`);
  }
} catch (ex) {
  console.log(ex);
}

function findImpressionText(data, targetKey) {
  if (typeof data === "object") {
    if (data.hasOwnProperty("x0040a730")) {
      const report = data["x0040a730"];
      for (const data of report) {
        if (data.hasOwnProperty("x0040a043")) {
          const codes = data["x0040a043"];
          for (const code of codes) {
            if (
              code.hasOwnProperty("x00080100") &&
              code["x00080100"] === targetKey
            ) {
              if (data.hasOwnProperty("x0040a160")) {
                return data["x0040a160"];
              }
            }
          }
        }
      }
    }
  }
  return null;
}
