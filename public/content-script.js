// Add ability for dApp/website to send a message to this extension
const sendMessage = async ({ detail }) => {
  console.log('sendMessage() | detail: ', detail);
  await window.chrome.runtime.sendMessage(detail);
  return true;
};
// Initial check to make sure the extension is loaded and ready, once ready, create the event listener
function ping() {
  console.log('running ping()');
  window.chrome.runtime.sendMessage('ping', response => {
    if(window.chrome.runtime.lastError) {
      setTimeout(ping, 1000);
    } else {
      // Create listener for send message event
      document.addEventListener("provWalletSendMessage", sendMessage);
    }
  });
}
// Run initial ping check loop
ping();
