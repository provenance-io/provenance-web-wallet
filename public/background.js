/* global chrome */


chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('message: ', request, sender, sendResponse);
    chrome.windows.get(sender.tab.windowId).then((senderWindow) => {
      const screenLeftPos = senderWindow.left + senderWindow.width;
      const width = 375;
      const height = 600;
      const top = 0;
      // const left = screenLeft - width;
      const left = screenLeftPos - width;
      const type = 'popup';
      const wcCode = request?.openUrlInEditor;
      const popupUrl = 'index.html';
      const fullUrl = `${popupUrl}?wc=${wcCode}`;
      const createData = {
        focused: true,
        height,
        width,
        top,
        left,
        type,
        url: fullUrl,
      }
      console.log('senderWindow: ', senderWindow);
      console.log('createData: ', createData);
      chrome.windows.create(createData);
    });
  });
console.log('background.js');
