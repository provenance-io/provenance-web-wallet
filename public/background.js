/* global chrome */
// ----------------------------------------
// Handle Notification Popup Window
// ----------------------------------------
const notificationPopupEvent = function(request, sender, sendResponse) {
  chrome.windows.get(sender.tab.windowId).then((senderWindow) => {
    // Basic popup config
    const popupConfig = {
      focused: true,
      height: 628,
      width: 375,
      top: 0,
      type: 'popup',
      url: `index.html`,
      left: (senderWindow.left + senderWindow.width) - 375,
    };
    // Run function based on the event
    const { event, uri } = request;
    switch (event) {
      case 'walletconnect_init':
        // Uri is required to be included
        if (uri) {
          // update the popup config url
          popupConfig.url = `${popupConfig.url}?wc=${uri}`;
          chrome.windows.create(popupConfig);
        }
        break;
      case 'walletconnect_event':
        // walletconnect event passed through, should trigger same as .on(event_name, callback)
        chrome.action.setBadgeText({text: 'Sign'});
        chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        popupConfig.url = `${popupConfig.url}?redirectTo=NOTIFICATION_URL`;
        chrome.windows.create(popupConfig);
        break;
      default: break;
    }
  });
};

// ----------------------------------------
// Setup all event listeners
// ----------------------------------------
chrome.runtime.onMessageExternal.addListener(notificationPopupEvent);

const asyncGetStorage = async () => {
  const allData = await chrome.storage.local.get();
  console.log('allData :', allData);
};
asyncGetStorage();
