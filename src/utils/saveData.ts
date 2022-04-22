// Determine storage type for app
const useChromeStorage = !!window?.chrome?.storage;
const localSaveName = process.env.REACT_APP_LOCAL_SAVE_NAME || 'provenance-web-wallet';

// ----------------------
// Session Storage
// ----------------------
const getSessionStorageData = (key?: string) => {
  // Look for the item in the current localStorage, if found, add to results
  const rawData = window.sessionStorage.getItem(localSaveName) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};
const addSessionStorageData = (newData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Pull from localStorage
  const rawData = window.sessionStorage.getItem(localSaveName) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  const finalData = {...data, ...newData};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  window.sessionStorage.setItem(localSaveName, stringFinalData);
};
const clearSessionStorageData = () => {
  sessionStorage.removeItem(localSaveName);
};

// ----------------------
// Chrome Storage
// ----------------------
const getChromeStorage = (key?: string) => {
  // Speficic value
  if (key) return chrome.storage.local.get(key, (result) => { return result })
  // All values
  return chrome.storage.local.get(null, (result) => { return result })
};
const addChromeStorage = () => {
  console.log('TODO: addChromeStorage');
};
const clearChromeStorage = () => {
  console.log('TODO: clearChromeStorage');
};

// ----------------------
// Storage Functions
// ----------------------
// Get one or more values from storage
export const getSavedData = (key?: string) => {
  if (useChromeStorage) return getChromeStorage(key)
  return getSessionStorageData(key);
};
// Add to storage
export const addSavedData = (newData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (useChromeStorage) addChromeStorage();
  else addSessionStorageData(newData);
};
// Clear out storage
export const clearSavedData = () => {
  if (useChromeStorage) clearChromeStorage();
  else clearSessionStorageData();
};
// Special Key storage
export const saveKey = (key: string) => {
  const keyString = JSON.stringify({key});
  if (useChromeStorage) console.log('saveKey Chrome');
  else window.localStorage.setItem(localSaveName, keyString);
}
export const clearKey = () => {
  if (useChromeStorage) console.log('clearKey Chrome');
  else localStorage.removeItem(localSaveName);
}
export const getKey = () => {
  if (useChromeStorage) return '';
  const rawLocalStorageData = window?.localStorage?.getItem(localSaveName) || '';
  const localStorageData = rawLocalStorageData ? JSON.parse(rawLocalStorageData) : {};
  return localStorageData.key;
}