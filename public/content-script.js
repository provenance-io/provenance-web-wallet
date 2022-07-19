document.addEventListener("provWalletSendMessage", async function ({ detail }) { await window.chrome.runtime.sendMessage(detail) });
