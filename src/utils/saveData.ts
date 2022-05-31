import { LOCAL_SAVE_NAME } from 'consts';
import {
  AccountStorage,
  Settings,
  WalletConnectStorage,
} from 'types';

// Determine storage type for app
const useChromeStorage = !!window?.chrome?.storage;

// ----------------------
// Types
// ----------------------
type StorageData = {} | [];
interface StorageItems {
  account: AccountStorage,
  settings?: Settings,
  walletconnect?: WalletConnectStorage,
};
type StorageItemKey = keyof StorageItems;
// ----------------------
// Session/Local Storage
// ----------------------
export const getStorageData = (key?: StorageItemKey, savedName = LOCAL_SAVE_NAME!) => {
  const windowData = window.localStorage;
  // Look for the item in the current localStorage, if found, add to results
  const rawData = windowData.getItem(savedName) || '{}';
  const data = JSON.parse(rawData);
  // If no specific key is passed, just return the entire object
  return key ? data[key] : data;
};
const addStorageData = (newData: StorageData) => {
  const windowData = window.localStorage;
  // Pull from storage
  const rawData = windowData.getItem(LOCAL_SAVE_NAME!) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  const finalData = {...data, ...newData};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  windowData.setItem(LOCAL_SAVE_NAME!, stringFinalData);
};

// ----------------------
// Chrome Storage
// ----------------------
const getChromeStorage = async (keyValue?: StorageItemKey) => {
  if (keyValue) {
    const result = await chrome.storage.local.get(keyValue);
    return result[keyValue];
  } else return await chrome.storage.local.get();
}
const addChromeStorage = async (newData: StorageData) => {
  await chrome.storage.local.set(newData);
};

// ----------------------
// Storage Functions
// (Will automatically use browser default or chrome storage)
// ----------------------
// Get one or more values from storage
export const getSavedData = async (key?: StorageItemKey) => {
  if (useChromeStorage) return await getChromeStorage(key);
  else {
    return getStorageData(key);
  }
};
// Add to storage
export const addSavedData = async (newData: StorageData) => {
  if (useChromeStorage) await addChromeStorage(newData);
  else addStorageData(newData);
};
