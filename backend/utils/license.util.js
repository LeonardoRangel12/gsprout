const randexpUtil = require("../utils/randexp.util");

const generateLicense = async function (regex) {
    // Generate the license
  const license = await randexpUtil.generateLicense(regex);
  return license;
};

module.exports = {
  generateLicense,
};
