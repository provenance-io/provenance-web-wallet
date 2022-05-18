import { LOCAL_SAVE_NAME, DEFAULT_ACCOUNT_NAME } from 'consts';
import { EventPayload } from 'types';

// Determine storage type for app
const useChromeStorage = !!window?.chrome?.storage;
const localSaveName = LOCAL_SAVE_NAME || 'provenance-web-wallet';

// ----------------------
// Types
// ----------------------
interface Account {
  name?: string,
  id: number,
  network?: string,
  address?: string,
  publicKey?: string,
}
type AccountIndex = number;
interface Settings {
  unlockEST?: number, // When was the current unlock established at
  unlockEXP?: number, // When will the current unlock expire at
  unlockDuration?: number, // How long is each unlock's lifespan
  walletconnect?: { // WalletConnect session data
    connectionEST?: number, // When did we connect with walletconnect
    connectionEXP?: number, // When are we predicted to expire (actions refresh EST time)
    connectionDuration?: number, // How long from EST to EXP
  }
}
interface PendingRequest {};
type StorageData = {} | [];
interface StorageItems {
  accounts?: Account[],
  activeAccountId?: AccountIndex,
  key?: string,
  settings?: Settings,
  pendingRequests?: PendingRequest[],
  totalPendingRequests?: number,
};
type StorageItemKey = keyof StorageItems;
// ----------------------
// Session/Local Storage
// ----------------------
const getStorageData = (key?: StorageItemKey, savedName = localSaveName) => {
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
const removeStorageData = (key: StorageItemKey, customLocalSaveName = localSaveName) => {
  const windowData = window.localStorage;
  // Pull from storage
  const rawData = windowData.getItem(customLocalSaveName) || '{}';
  // Parse to edit
  const data = JSON.parse(rawData);
  // Update key/value
  delete data[key];
  const finalData = {...data};
  // Stringify to save
  const stringFinalData = JSON.stringify(finalData);
  // Save
  windowData.setItem(customLocalSaveName, stringFinalData);
};
const clearStorageData = (customLocalSaveName = localSaveName) => {
  const windowData = window.localStorage;
  windowData.removeItem(customLocalSaveName);
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
const removeChromeStorage = async (key: StorageItemKey) => {
  await chrome.storage.local.remove(key);
}
const clearChromeStorage = async () => {
  await chrome.storage.local.clear();
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
  if (useChromeStorage) addChromeStorage(newData);
  else addStorageData(newData);
};
// Clear out single value
export const removeSavedData = async (key: StorageItemKey) => {
  if (useChromeStorage) removeChromeStorage(key);
  else removeStorageData(key);
}
// Clear out entire storage
export const clearSavedData = async () => {
  if (useChromeStorage) clearChromeStorage();
  else clearStorageData();
};
// ----------------------------
// Account Master Key storage
// ----------------------------
export const saveKey = async (key: string) => {
  await addSavedData({key});
};
export const getKey = async () => await getSavedData('key');
export const clearKey = async () => {
  await removeSavedData('key');
};
// ----------------------------
// Account Name map storage
// ----------------------------


export const saveAccount = async ({
  id,
  name = `${DEFAULT_ACCOUNT_NAME}${id}`,
  network,
  address,
  publicKey,
}:Account
) => {
  // Check if existing name obj exists, if not, make a new obj
  let existingAccounts = await getSavedData('accounts');

  // No existing accounts exist
  if (!existingAccounts) existingAccounts = [];
  // Add this accountName/accountIndex to object
  existingAccounts.push({ id, name, network, publicKey, address });
  // Save the map back to local storage
  addSavedData({accounts: existingAccounts});
};
export const getAccounts = async () => await getSavedData('accounts');
export const removeAccount = async (id: AccountIndex) => {
  // Check if existing name obj exists, if not, make a new obj
  let existingAccounts = await getSavedData('accounts');
  if (!existingAccounts) existingAccounts = [];
  existingAccounts.filter(({ id: accountId }: Account) => { return (id !== accountId) });
  // Save the map back to local storage
  addSavedData(existingAccounts);
};
export const clearAccounts = async () => {
  removeSavedData('accounts');
};

// ----------------------------
// WalletConnect Data
// ----------------------------
// Walletconnect will always save to localstorage
export const getWalletConnectStorage = async () => {
  return getStorageData(undefined, 'walletconnect');
}
export const clearWalletConnectStorage = async () => {
  return clearStorageData('walletconnect');
}

// ----------------------------
// Pending Request storage
// ----------------------------
const PENDING_REQUESTS = 'pendingRequests';
export const addPendingRequest = async (id: string, data: EventPayload) => {
  // Get all pendingRequests (if it doesn't exist we will create an empty object)
  const existingPendingRequests = await getSavedData(PENDING_REQUESTS) || {};
  // Add new id (or replace existing id) to pending requests and set data 
  existingPendingRequests[id] = data;
  // Count total pendingRequests and update saved value
  const totalPendingRequests = Object.keys(existingPendingRequests).length;
  await addSavedData({ totalPendingRequests });
  chrome.action.setBadgeText({text: totalPendingRequests ? `${totalPendingRequests}` : ''});
  chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  // Save updated pending requests to storage
  await addSavedData({ [PENDING_REQUESTS]: existingPendingRequests });
};
// Remove all requests from storage
export const removeAllPendingRequests = async () => {
  await addSavedData({ totalPendingRequests: 0 });
  chrome.action.setBadgeText({text: ''});
  await removeSavedData(PENDING_REQUESTS);
};
// Get the count of pending requests
export const getPendingRequestCount = async () => {
  // Get all pendingRequests (if it doesn't exist we will create an empty object)
  const existingPendingRequests = await getSavedData(PENDING_REQUESTS) || {};
  return Object.keys(existingPendingRequests).length;
};
// Remove a specific pending request from storage
export const removePendingRequest = async (id: string) => {
  // Get all pendingRequests (if it doesn't exist we will create an empty object)
  const existingPendingRequests = await getSavedData(PENDING_REQUESTS) || {};
  // Delete the id (no error if it doesn't exist)
  delete existingPendingRequests[id];
  // Count total pendingRequests and update saved value
  const totalPendingRequests = Object.keys(existingPendingRequests).length;
  await addSavedData({ totalPendingRequests });
  chrome.action.setBadgeText({text: totalPendingRequests ? `${totalPendingRequests}` : ''});
  chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  // Save remaining pending requests
  await addSavedData({ [PENDING_REQUESTS]: existingPendingRequests });
};
export const getPendingRequest = async (id?: string) => {
  // Get all pendingRequests (if it doesn't exist we will create an empty object)
  const existingPendingRequests = await getSavedData(PENDING_REQUESTS) || {};
  // Return the requested id or all requests
  return id ? existingPendingRequests[id] : existingPendingRequests;
};
// ----------------------------
// Extension Session Settings
// ----------------------------
export const saveSettings = async (settings: Settings) => {
  // Get existing settings
  const existingSettings = await getSavedData('settings');
  // Combine settings
  const newSettings = { ...existingSettings, ...settings };
  await addSavedData({ settings: newSettings });
};
export const getSettings = async (setting?: keyof Settings) => {
  // Get existing settings
  const existingSettings = await getSavedData('settings') || {};
  return setting ? existingSettings[setting] : existingSettings;
};
