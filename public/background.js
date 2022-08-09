/* global chrome */
// ----------------------------------------
// Handle Notification Popup Window
// ----------------------------------------
const notificationPopupEvent = async function(request, sender, sendResponse) {
  // When just pinging, don't do anything else
  if (request === 'ping' || !request) {
    sendResponse();
    return true;
  };
  // Check if the user has an account/wallet
  const { account } = await chrome.storage.local.get('account') || {};
  const hasAccount = !!account?.accounts.length;
  // Open a new window popup as the extension
  await chrome.windows.get(sender.tab.windowId).then((senderWindow) => {
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
    // If the user doesn't have an account, just open a page telling them to make one
    if (!hasAccount) {
      // Redirect popup to the notifications page which will detect that the user has no accounts and show the proper messaging
      popupConfig.url = `${popupConfig.url}?redirectTo=NOTIFICATION_URL`;
      chrome.windows.create(popupConfig);
    } else {
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
          popupConfig.url = `${popupConfig.url}?redirectTo=NOTIFICATION_URL`;
          chrome.windows.create(popupConfig);
          break;
        case 'walletconnect_disconnect':
          // Reset all saved walletconnect data
          chrome.storage.local.set({
            walletconnect: {
              connectionEST: 0,
              connectionEXP: 0,
              pendingRequests: {},
              totalPendingRequests: 0,
            }
          });
          // Revert chrome extension icon to normal colors
          chrome.action.setIcon({
            path: {
              16: '16.png',
              32: '32.png',
              48: '48.png',
              128: '128.png',
            },
          });
          break;
        default: break;
      }
    }
  });
  sendResponse();
  return true;
};

const asyncGetStorage = async () => {
  const { walletconnect } = await chrome.storage.local.get('walletconnect') || {};
  const totalPendingRequests = walletconnect?.totalPendingRequests || 0;
  // Update the badge based on the existing number of requests
  chrome.action.setBadgeText({text: `${totalPendingRequests || ''}`});
  chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  return true;
};
asyncGetStorage();

// ----------------------------------------
// Setup all event listeners
// ----------------------------------------
const asyncSetup = async () => {
  chrome.runtime.onMessage.addListener(notificationPopupEvent);
  return true;
}
asyncSetup();
