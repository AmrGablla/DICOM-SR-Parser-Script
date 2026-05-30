/**
 * Common RSNA / DCM code values used in imaging reports (reference only).
 * Map your site’s SR template codes in a local preset file.
 */
module.exports = {
  dcm: {
    imagingMeasurementReport: {
      codeValue: "126000",
      codingSchemeDesignator: "DCM",
      codeMeaning: "Imaging Measurement Report",
    },
    finding: {
      codeValue: "121071",
      codingSchemeDesignator: "DCM",
      codeMeaning: "Finding",
    },
  },
};
