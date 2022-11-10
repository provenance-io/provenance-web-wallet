import { NEW_TAB_ROOT_URL } from 'consts';

export const openTab = (url: string) => {
  if (chrome?.tabs?.create)
    chrome.tabs.create({ url: `${NEW_TAB_ROOT_URL}#${url}` });
  else window.open(url, '_blank')?.focus();
};
