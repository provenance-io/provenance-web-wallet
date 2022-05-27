const glob = require('glob');
const fs = require('fs');
const PrettyError = require('pretty-error');

const getDirectories = function (src, callback) {
  const res = glob.sync(src + '/**/*');
  callback(res);
};

const fileTypes = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx'];
const warningComments = [
  'TODO:',
];
const errorComments = [
  'TEMP:',
  'TEMPONLY:',
  'TEMP ONLY:',
  'TESTING:',
  'TEST:',
  'TESTONLY:',
  'TEST ONLY:',
  'TESTINGONLY:',
  'TESTING ONLY:',
  'REMOVEME:',
  'REMOVE ME:',
  'REMOVE:',
  'HACK:',
];
const rootDirs = ['src'];

const checkIfValidFile = function (fileSrc) {
  let valid = false;
  fileTypes.forEach((fileType) => {
    if (fileSrc.includes(fileType)) {
      valid = true;
    }
  });
  return valid;
}

const checkIfCommentMatches = function (fileData, commentArray) {
  let commentExists = false;
  commentArray.forEach((comment) => {
    if (fileData.includes(comment)) {
      commentExists = true;
    }
  });
  return commentExists;
}

const createPrettyError = function (message, bgColor = 'red', textColor = 'bright-white') {
  /*
    type PrettyErrorColors =
    'black' | 'red' | 'green' | 'yellow' | 'blue' |
    'magenta' | 'cyan' | 'white' | 'grey' | 'bright-red' |
    'bright-green' | 'bright-yellow' | 'bright-blue' |
    'bright-magenta' | 'bright-cyan' | 'bright-white';
  */

  const pe = new PrettyError();
  const peGenericStyle = {
    'pretty-error > header > title > kind': { display: 'none' },
    'pretty-error > header > colon': { display: 'none' },
    'pretty-error > trace > item': { display: 'none' },
  }
  pe.appendStyle({
    ...peGenericStyle,
    'pretty-error > header > message': {
      color: textColor,
      background: bgColor,
      padding: '0 1',
    },
  });
  const renderedError = pe.render(new Error(message));
  console.log(renderedError);
}

module.exports.commentSniffer = function () {
  const allErrors = [];
  const allWarnings = [];
  let totalDirectoriesChecked = 0;
  rootDirs.forEach(rootDir => {
    getDirectories(rootDir, function (res) {
      // Look at each file
      res.forEach(fileLocation => {
        totalDirectoriesChecked ++;
        const valid = checkIfValidFile(fileLocation);
        if (valid) {
          const data = fs.readFileSync(fileLocation);
          const hasErrorComment = checkIfCommentMatches(data, errorComments);
          const hasWarningComment = checkIfCommentMatches(data, warningComments);
          if (hasErrorComment) {
            allErrors.push(fileLocation);
          }
          if (hasWarningComment) {
            allWarnings.push(fileLocation);
          }
        };
      });
    });
  })
  // Let the user know how many files we just checked
  createPrettyError(`CommentSniffer checked ${totalDirectoriesChecked} total files\n`, 'grey', 'bright-white');
  if (allErrors.length || allWarnings.length) {
    let errorMessage = '';
    let warningMessage = '';
    // Check error comments first
    if (allErrors.length) {
      errorMessage = `${allErrors.length} Dev Local Only Comments Found!  Please Fix/Remove:\n --------------------------------------------------\n`;
      allErrors.forEach(msg => {
        errorMessage += ` \n • ${msg}`;
      });
      createPrettyError(errorMessage, 'red', 'bright-white');
    }
    // Check for warning comments
    if (allWarnings.length) {
      const warningTitle = `${allWarnings.length} Warning Comments Found:\n --------------------------------------------------\n`;
      warningMessage += errorMessage ? `\n${warningTitle}` : `${warningTitle}`;
      allWarnings.forEach(msg => {
        warningMessage += ` \n • ${msg}`;
      });
      createPrettyError(warningMessage, 'yellow', 'black');
    }
    // If we had any errors, send back a failure
    if (allErrors.length) process.exit(1);
  } else {
    // No errors or warnings to display
    const successMessage = 'All comment checks passed';
    createPrettyError(successMessage, 'green', 'bright-white');
  }
};
