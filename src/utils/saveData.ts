// Determine storage type for app
const useChromeStorage = !!window?.chrome?.storage;
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
const getChromeStorage = async (keyValue?: StorageKey) => {
  if (keyValue) {
    const result = await chrome.storage.local.get(keyValue);
    return result[keyValue];
  } else return await chrome.storage.local.get();
}
const addChromeStorage = (newData: StorageData) => {
  chrome.storage.local.set(newData);
};
const removeChromeStorage = (key: StorageKey) => {
  chrome.storage.local.remove(key);
}
const clearChromeStorage = () => {
  chrome.storage.local.clear();
};

// ----------------------
// Storage Functions
// (Will automatically use browser default or chrome storage)
// ----------------------
// Get one or more values from storage
export const getSavedData = async (key?: StorageKey, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) return await getChromeStorage(key);
  else {
    return getStorageData(key, type);
  }
};
// Add to storage
export const addSavedData = (newData: StorageData, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) addChromeStorage(newData);
  else addStorageData(newData, type);
};
// Clear out single value
export const removeSavedData = (key: StorageKey, type: StorageType = 'sessionStorage') => {
  if (useChromeStorage) removeChromeStorage(key);
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
export const saveKey = async (key: string) => {
  await addSavedData({key}, 'localStorage');
};
export const getKey = async () => await getSavedData('key', 'localStorage');
export const clearKey = async () => {
  await removeSavedData('key', 'localStorage');
};
// ----------------------------
// Account Name map storage
// ----------------------------
type Account = {
  name?: string,
  id: number,
  network?: string,
  address?: string,
  publicKey?: string,
}
type AccountIndex = number;

export const saveAccount = async ({
  id,
  name = `${defaultAccountName}${id}`,
  network,
  address,
  publicKey,
}:Account
) => {
  // Check if existing name obj exists, if not, make a new obj
  let existingAccounts = await getSavedData('accounts', 'localStorage');

  // No existing accounts exist
  if (!existingAccounts) existingAccounts = [];
  // Add this accountName/accountIndex to object
  console.log('existingAccounts :', existingAccounts);
  existingAccounts.push({ id, name, network, publicKey, address });
  // Save the map back to local storage
  addSavedData({accounts: existingAccounts}, 'localStorage');
};
export const getAccounts = async () => await getSavedData('accounts', 'localStorage');
export const removeAccount = async (id: AccountIndex) => {
  // Check if existing name obj exists, if not, make a new obj
  let existingAccounts = await getSavedData('accounts', 'localStorage');
  if (!existingAccounts) existingAccounts = [];
  existingAccounts.filter(({ id: accountId }: Account) => { return (id !== accountId) });
  // Save the map back to local storage
  addSavedData(existingAccounts, 'localStorage');
};
export const clearAccounts = () => {
  removeSavedData('accounts', 'localStorage');
};
