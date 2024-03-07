const randexpUtil = require("../utils/randexp.util");

const generateLicense = async function (juego) {
    // Generate the license
  const license = await randexpUtil.generateLicense(juego.regexLicense);
  return license;
};

module.exports = {
  generateLicense,
};
