const reregexp = require("reregexp").default;
const cryptojsUtil = require("./cryptojs.util");

const generateLicense = async function (license) {
  // Decrypt the regex and generate a license with it
  const regex = await cryptojsUtil.decrypt(license);
  const r1 = new reregexp(regex);
  return r1.build();
};

module.exports = {
  generateLicense,
};
