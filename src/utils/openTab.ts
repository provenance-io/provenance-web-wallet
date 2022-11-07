import { POPUP_ROOT_URL } from 'consts';

export const openTab = (url: string) => {
  chrome.tabs.create({ url: `${POPUP_ROOT_URL}${url}` });
};
