export const openTab = (url: string) => {
  chrome.tabs.create({ url });
};
