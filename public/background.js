chrome.runtime.onMessageExternal.addListener( //eslint-disable-line
  function(request, sender, sendResponse) {
    console.log('message: ', request, sender, sendResponse);
  });
console.log('background.js');
