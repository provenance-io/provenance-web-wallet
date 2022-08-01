const glob = require('glob');
const fs = require('fs');
const PrettyError = require('pretty-error');

const getDirectories = function (src, callback) {
  const res = glob.sync(src + '/**/*');
  callback(res);
};

const fileTypes = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx'];
const warningComments = ['TODO:'];
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
};

const checkIfCommentMatches = function (fileData, commentArray) {
  let commentCount = 0;
  commentArray.forEach((comment) => {
    const matchArray = [...fileData.matchAll(comment)];
    commentCount += matchArray.length;
  });
  return commentCount;
};

const createPrettyError = function (
  message,
  bgColor = 'red',
  textColor = 'bright-white'
) {
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
  };
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
};

module.exports.commentSniffer = function () {
  const allErrors = [];
  const allWarnings = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalDirectoriesChecked = 0;
  rootDirs.forEach((rootDir) => {
    getDirectories(rootDir, function (res) {
      // Look at each file
      res.forEach((fileLocation) => {
        totalDirectoriesChecked++;
        const valid = checkIfValidFile(fileLocation);
        if (valid) {
          const data = fs.readFileSync(fileLocation, 'utf-8');
          const errorCommentCount = checkIfCommentMatches(data, errorComments);
          const warningCommentCount = checkIfCommentMatches(data, warningComments);
          if (errorCommentCount) {
            // Add to totalErrors
            totalErrors += errorCommentCount;
            allErrors.push(`${fileLocation} (${errorCommentCount})`);
          }
          if (warningCommentCount) {
            // Add to totalWarnings
            totalWarnings += warningCommentCount;
            allWarnings.push(`${fileLocation} (${warningCommentCount})`);
          }
        }
      });
    });
  });
  // Let the user know how many files we just checked
  createPrettyError(
    `CommentSniffer checked ${totalDirectoriesChecked} total files\n`,
    'grey',
    'bright-white'
  );
  if (totalErrors || totalWarnings) {
    let errorMessage = '';
    let warningMessage = '';
    // Check error comments first
    if (totalErrors) {
      errorMessage = `${totalErrors} Dev Local Only Comments Found!  Please Fix/Remove:\n --------------------------------------------------\n`;
      allErrors.forEach((msg) => {
        errorMessage += ` \n • ${msg}`;
      });
      createPrettyError(errorMessage, 'red', 'bright-white');
    }
    // Check for warning comments
    if (totalWarnings) {
      const warningTitle = `${totalWarnings} Warning Comments Found:\n --------------------------------------------------\n`;
      warningMessage += errorMessage ? `\n${warningTitle}` : `${warningTitle}`;
      allWarnings.forEach((msg) => {
        warningMessage += ` \n • ${msg}`;
      });
      createPrettyError(warningMessage, 'yellow', 'black');
    }
    // If we had any errors, send back a failure
    if (totalErrors) process.exit(1);
  } else {
    // No errors or warnings to display
    const successMessage = 'All comment checks passed';
    createPrettyError(successMessage, 'green', 'bright-white');
  }
};
