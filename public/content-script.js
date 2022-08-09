// Add ability for dApp/website to send a message to this extension
const sendMessage = async ({ detail }) => {
  await window.chrome.runtime.sendMessage(detail);
  return true;
};
// Initial check to make sure the extension is loaded and ready, once ready, create the event listener
function ping() {
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


// Inject provenance provider object into the dApp window object
(() => {
  try {
    // Injection location
    const container = document.head || document.documentElement;
    // Create a new script element to add onto the page
    const scriptTag = document.createElement('script');
    // Set the source of this new script
    scriptTag.src = window.chrome.runtime.getURL('provenance-blockchain-wallet.js');
    // Add the script tag into the container
    container.insertBefore(scriptTag, container.children[0]);
    // Remove the script tag from the container  
    container.removeChild(scriptTag);
  } catch (error) {
    console.error('Provenance Blockchain Wallet: Provider injection failed.', error);
  }
})();
