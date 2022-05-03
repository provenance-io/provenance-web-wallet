/* global chrome */
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.windows.get(sender.tab.windowId).then((senderWindow) => {
      const { uri } = request;
      if (uri) {
        const screenLeftPos = senderWindow.left + senderWindow.width;
        const width = 375;
        const height = 628;
        const top = 0;
        const left = screenLeftPos - width;
        const type = 'popup';
        const popupUrl = 'index.html';
        const fullUrl = `${popupUrl}?wc=${uri}`;
        const createData = {
          focused: true,
          height,
          width,
          top,
          left,
          type,
          url: fullUrl,
        }
        chrome.windows.create(createData);
      }
    });
  });
