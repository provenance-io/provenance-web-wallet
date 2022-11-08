import { NEW_TAB_ROOT_URL } from 'consts';

export const openTab = (url: string) => {
  chrome.tabs.create({ url: `${NEW_TAB_ROOT_URL}${url}` });
};
