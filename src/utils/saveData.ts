import { AccountStorage, SettingsStorage, WalletConnectStorage } from 'types';

// ----------------------
// Types
// ----------------------
type StorageData = {} | [];
interface StorageItems {
  account: AccountStorage;
  settings?: SettingsStorage;
  walletconnect?: WalletConnectStorage;
}
type StorageItemKey = keyof StorageItems;
type ChromeStorageKeys = string | string[];
// -------------------------------------------------------------
// Session/Local Storage (used for 3rd party walletconnect)
// -------------------------------------------------------------
export const getStorageData = (savedName: string, key?: StorageItemKey) => {
  const windowData = window.localStorage;
  // Look for the item in the current localStorage, if found, add to results
  const rawData = windowData.getItem(savedName) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};

// ----------------------
// Chrome Storage
// ----------------------
const getChromeStorage = async (keyValue?: StorageItemKey) => {
  if (keyValue) {
    const result = await chrome.storage.local.get(keyValue);
    return result[keyValue];
  } else return await chrome.storage.local.get();
};
const addChromeStorage = async (newData: StorageData) => {
  await chrome.storage.local.set(newData);
};
const removeChromeStorage = async (keys: ChromeStorageKeys) => {
  await chrome.storage.local.remove(keys);
};

// ----------------------
// Storage Functions
// ----------------------
// Get one or more values from storage
export const getSavedData = async (key?: StorageItemKey) => {
  return await getChromeStorage(key);
};
// Add to storage
export const addSavedData = async (newData: StorageData) => {
  await addChromeStorage(newData);
};
// Remove stored item(s)
export const removeSavedData = async (keys: ChromeStorageKeys) => {
  removeChromeStorage(keys);
};
