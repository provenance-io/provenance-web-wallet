const fs = require('fs');

// npm_package_version comes from package.json "version"
// Pull the app version and apply it to other files in this repo as needed
const APP_VERSION = process.env.npm_package_version;

const regularExpressionMatch = /"version":(.+),/i;
const filesToChange = [
  'public/manifest.json',
  'public/provenance-blockchain-wallet.js',
];

module.exports.versionUp = function () {
  console.log('APP_VERSION: ', APP_VERSION);
  // Loop through each file location
  filesToChange.forEach((fileLocation) => {
    // Get all data as string from file location
    const data = fs.readFileSync(fileLocation, 'utf-8');
    // data is a string containing the fields we want to change
    // find the fields and change them
    const updatedData = data.replace(
      regularExpressionMatch,
      `"version": "${APP_VERSION}",`
    );
    fs.writeFileSync(fileLocation, updatedData);
  });
};
