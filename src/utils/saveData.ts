// Determine storage type for app
// const useChromeStorage = !!window?.chrome?.storage;
const useChromeStorage = false;
const localSaveName = process.env.REACT_APP_LOCAL_SAVE_NAME || 'provenance-web-wallet';
const defaultAccountName = process.env.REACT_APP_DEFAULT_ACCOUNT_NAME;

// ----------------------
// Session/Local Storage
// ----------------------
type StorageType = 'sessionStorage' | 'localStorage';
type StorageData = {} | [];
type StorageKey = string;
const getStorageData = (key?: StorageKey, type: StorageType = 'sessionStorage') => {
  const windowData = window[type];
  // Look for the item in the current localStorage, if found, add to results
  const rawData = windowData.getItem(localSaveName) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};
const addStorageData = (newData: StorageData, type: StorageType = 'sessionStorage') => {
  const windowData = window[type];
  // Pull from storage
  const rawData = windowData.getItem(localSaveName) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  const finalData = {...data, ...newData};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  windowData.setItem(localSaveName, stringFinalData);
};
const removeStorageData = (key: StorageKey, type: StorageType = 'sessionStorage') => {
  const windowData = window[type];
  // Pull from storage
  const rawData = windowData.getItem(localSaveName) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  delete data[key];
  const finalData = {...data};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  windowData.setItem(localSaveName, stringFinalData);
};
const clearStorageData = (type: StorageType = 'sessionStorage') => {
  const windowData = window[type];
  windowData.removeItem(localSaveName);
};

// ----------------------
// Chrome Storage
// ----------------------
const getChromeStorage = () => {
  console.log('TODO: getChromeStorage');
  // // Speficic value
  // if (key) return chrome.storage.local.get(key, (result) => { return result })
  // // All values
  // return chrome.storage.local.get(null, (result) => { return result })
};
const addChromeStorage = () => {
  console.log('TODO: addChromeStorage');
};
const removeChromeStorage = () => {
  console.log('TODO: removeChromeStorage');
}
const clearChromeStorage = () => {
  console.log('TODO: clearChromeStorage');
};

// ----------------------
// Storage Functions
// (Will automatically use browser default or chrome storage)
// ----------------------
// Get one or more values from storage
export const getSavedData = (key?: StorageKey, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) return getChromeStorage();
  return getStorageData(key, type);
};
// Add to storage
export const addSavedData = (newData: StorageData, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) addChromeStorage();
  else addStorageData(newData, type);
};
// Clear out single value
export const removeSavedData = (key: StorageKey, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) removeChromeStorage();
  else removeStorageData(key, type);
}
// Clear out entire storage
export const clearSavedData = (type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) clearChromeStorage();
  else clearStorageData(type);
};
// ----------------------------
// Account Master Key storage
// ----------------------------
export const saveKey = (key: string) => {
  addSavedData({key}, 'localStorage');
};
export const getKey = () => {
  return getSavedData('key', 'localStorage');
};
export const clearKey = () => {
  removeSavedData('key', 'localStorage');
};
// ----------------------------
// Account Name map storage
// ----------------------------
type Account = {
  name?: string,
  id: number,
  network: string,
}
type AccountIndex = number;

export const saveAccount = ({
  id,
  name = `${defaultAccountName}${id}`,
  network,
}:Account
) => {
  // Check if existing name obj exists, if not, make a new obj
  const existingAccounts = getSavedData('accounts', 'localStorage') || [];
  // Add this accountName/accountIndex to object
  existingAccounts[id] = { id, name, network };
  // Save the map back to local storage
  addSavedData({accounts: existingAccounts}, 'localStorage');
};
export const getAccounts = () => {
  return getSavedData('accounts', 'localStorage');
};
export const removeAccount = (id: AccountIndex) => {
  // Check if existing name obj exists, if not, make a new obj
  const existingAccounts = getSavedData('accounts', 'localStorage') || [];
  delete existingAccounts[id];
  // Convert back to JSON string for storage
  const existingAccountsString = JSON.stringify({accounts: existingAccounts});
  // Save the map back to local storage
  addSavedData(existingAccountsString, 'localStorage');
};
export const clearAccounts = () => {
  removeSavedData('accounts', 'localStorage');
};
