import { AccountStorage, SettingsStorage, WalletConnectStorage } from 'types';
interface StorageItems {
  account: AccountStorage;
  settings?: SettingsStorage;
  walletconnect?: WalletConnectStorage;
}
type StorageItemKey = keyof StorageItems;
type ChromeStorageKeys = string | string[];

const localStorageName = 'provenance-blockchain-wallet';
// GET
// Spoof window.chrome.storage.local.get()
const chromeStorageGet = (keyValue?: StorageItemKey) =>
  new Promise((resolve) => {
    const existingStorageValue = JSON.parse(
      window.localStorage.getItem(localStorageName) || '{}'
    );
    const result = keyValue ? existingStorageValue[keyValue] : existingStorageValue;
    if (keyValue) {
      resolve(
        existingStorageValue[keyValue] === 'undefined' ? {} : { [keyValue]: result }
      );
    } else {
      resolve(existingStorageValue === 'undefined' ? {} : result);
    }
  });
// SET
// Spoof window.chrome.storage.local.set()
const chromeStorageSet = (data: { [key: string]: any }) =>
  new Promise((resolve) => {
    const existingStorageValue = JSON.parse(
      window.localStorage.getItem(localStorageName) || '{}'
    );
    // Take the data given, and merge it with the existing data
    const newStorageValue = { ...existingStorageValue, ...data };
    // Save to local storage
    window.localStorage.setItem(localStorageName, JSON.stringify(newStorageValue));
    return resolve(true);
  });
// REMOVE
// Spoof window.chrome.storage.local.remove()
const chromeStorageRemove = (keys: ChromeStorageKeys) =>
  new Promise((resolve) => {
    const existingStorageValue = JSON.parse(
      window.localStorage.getItem(localStorageName) || '{}'
    );
    // Clone existing data to manipulate
    const newStorageValue = { ...existingStorageValue };
    // Turn keys into an array if it isn't already
    const keysArray = Array.isArray(keys) ? keys : [keys];
    // Loop through each key and delete it if it exists
    keysArray.forEach((key) => {
      delete newStorageValue[key];
    });
    // Save whatever remains to local storage
    window.localStorage.setItem(localStorageName, JSON.stringify(newStorageValue));
    return resolve(true);
  });

// When running locally, we don't have access to window.chrome.storage.
// Use this function to build those methods
export const localChromeSpoof = () => {
  // Need to re-create the chrome.storage.local functions on the window object (assuming they don't exist)
  const storageExists = window?.chrome?.storage?.local;
  if (!storageExists) {
    window.chrome = window?.chrome || {};
    window.chrome.storage = window?.chrome?.storage || {};
    window.chrome.storage.local = window?.chrome?.storage?.local || {
      get: chromeStorageGet,
      set: chromeStorageSet,
      remove: chromeStorageRemove,
    };
  }
};
