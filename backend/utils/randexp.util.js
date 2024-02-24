const randexp = require("randexp");
const cryptojsUtil = require("./cryptojs.util");

const generateLicense = async function (license) {
  // Decrypt the regex and generate a license with it
  const regex = await cryptojsUtil.decrypt(license);
  return new randexp(regex).gen();
};

module.exports = {
  generateLicense,
};
