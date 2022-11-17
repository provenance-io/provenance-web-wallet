/* global chrome */
// ----------------------------------------
// Handle Notification Popup Window
// ----------------------------------------
const notificationPopupEvent = async function(request, sender, sendResponse) {
  const EXTENSION_POPUP_HEIGHT = 628;
  // const EXTENSION_POPUP_HEIGHT = 6280;
  const EXTENSION_POPUP_WIDTH = 375;
  // const EXTENSION_POPUP_WIDTH = 3750;
  const EXTENSION_POPUP_TYPE = 'popup';
  const EXTENSION_POPUP_BASEURL = 'index.html';

  // When just pinging, don't do anything else
  if (request === 'ping' || !request) {
    sendResponse();
    return true;
  };
  // Check if the user has an account/wallet
  const { account } = await chrome.storage.local.get('account') || {};
  const hasAccount = !!account?.accounts.length;
  // Open a new window popup as the extension
  await chrome.windows.get(sender.tab.windowId).then(async (senderWindow) => {
    const popupLeft = (senderWindow.left + senderWindow.width) - EXTENSION_POPUP_WIDTH;
    const popupTop = senderWindow.top;
    // Basic popup config
    const popupConfig = {
      focused: true,
      height: EXTENSION_POPUP_HEIGHT,
      width: EXTENSION_POPUP_WIDTH,
      top: popupTop,
      type: EXTENSION_POPUP_TYPE,
      url: EXTENSION_POPUP_BASEURL,
      left: popupLeft,
      // left: (senderWindow.left + senderWindow.width) - 375,
      // left: 4000,
    };
    // If the user already has a popup open, destroy the open popup (no multiple wallet popups)
    const existingWindows = await chrome.windows.getAll();
    existingWindows.forEach(async ({ id, type, width, height }) => {
      // Note: If we want to check the URL we will need to add a new 'tabs' permission to the manifect
      // This is a work around that should be fine 99% of the time until someone has a popup already open at this exact size...
      if (type === EXTENSION_POPUP_TYPE && width === EXTENSION_POPUP_WIDTH && height === EXTENSION_POPUP_HEIGHT) {
        // Remove this popup
        await chrome.windows.remove(id);
      }
    });
    // If the user doesn't have an account, just open a page telling them to make one
    if (!hasAccount) {
      // Redirect popup to the notifications page which will detect that the user has no accounts and show the proper messaging
      popupConfig.url = `${popupConfig.url}?redirectTo=NOTIFICATION_URL`;
      chrome.windows.create(popupConfig);
    } else {
      // Run function based on the event
      const { event, uri, duration, data, referral } = request;
      switch (event) {
        case 'resetConnectionTimeout':
          // Data is going to be the new connectionTimeout in ms
          // Update the new EXP and Duration values
          const connectionDuration = data;
          const connectionEXP = Date.now() + connectionDuration;
          // Pull existing walletconnect storage data
          const existingWalletconnectStorage = (await chrome.storage.local.get('walletconnect')).walletconnect;
          await chrome.storage.local.set({
            walletconnect: {
              ...existingWalletconnectStorage,
              connectionEXP,
              connectionDuration,
            }
          });
          break;
        case 'walletconnect_init':
          // Uri is required to be included
          if (uri) {
            // update the popup config url
            const wcUrl = `?wc=${uri}`;
            const durationUrl = duration ? `&duration=${duration}` : '';
            const referralUrl = referral ? `&referral=${referral}` : '';
            popupConfig.url = `${popupConfig.url}${wcUrl}${durationUrl}${referralUrl}`;
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
          await chrome.storage.local.set({
            walletconnect: {
              connectionEST: 0,
              connectionEXP: 0,
              pendingRequests: {},
              totalPendingRequests: 0,
              // We don't have access to window.localStorage in background.js.  Instead, set a var to clear it out upon app load (initial load) next time the extension opens
              killSession: true,
            }
          });
          // Clear out any pending actions
          await chrome.action.setBadgeText({text: ''});
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
