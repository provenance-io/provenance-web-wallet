import { DEFAULT_MAINNET_HD_PATH, DEFAULT_TESTNET_HD_PATH, TESTNET_WALLET_COIN_TYPE } from 'consts';

// Tests for this util live here: src/__tests__/completeHdPath.test.js

// Complete a partial hd path all the way down to account index
// Allow user to pass in addressIndex (as string, which will allow them to harden/unharded if needed)
export const completeHdPath = (partialHdPath: string, addressIndex?: string, child?: boolean): string => {
  // MAINNET: partialHdPath: m/44'/505'/0' => finalHdPath: m/44'/505'/0'/0/0
  // TESTNET: partialHdPath: m/44'/1'/0' => finalHdPath: m/44'/505'/0'/0/0'
  // If we are looking for a child, we are going to return the difference: egs: 
  // - MAINNET: partialHdPath: m/44'/505'/0' => finalHdPath: 0/0
  // - TESTNET: partialHdPath: m/44'/1'/0' => finalHdPath: 0/0'
  // Full hdPath to addressIndex length is 6
  const fullHdPathLength = 6;
  // hdPath array and each items index: [root(0), purpose(1), coinType(2), account(3), change(4), addressIndex(5)]
  const partialHdPathArray = partialHdPath.split('/');
  const partialLength = partialHdPathArray.length;
  // Already full length (or some wierd long length - just return what they passed in)
  if (partialLength >= fullHdPathLength) return partialHdPath;
  // Determine to use mainnet or testnet default paths (use mainnet by default)
  // Path must be at least length 3, and the index 2 is the coinType which we check against
  const defaultPath = partialLength >= 3 ?
    partialHdPathArray[2].includes(`${TESTNET_WALLET_COIN_TYPE}`) ?
    DEFAULT_TESTNET_HD_PATH :
    DEFAULT_MAINNET_HD_PATH :
    DEFAULT_MAINNET_HD_PATH;
  // Get the default mainnet/testnet path
  const defaultPathArray = defaultPath.split('/'); // [m, 44', 505', 0', 0, 0] or [m, 44', 1', 0', 0, 0']
  const defaultLength = defaultPathArray.length; // 6 (fullHdPathLength)
  // Copy the partial path array to make edits to it
  let completedHdPathArray = partialHdPathArray;
  // If the partial length is less than the default length, we need to use default fill in values from DEFAULT_MAINNET_HD_PATH
  if (partialLength < defaultLength) { // eg: m/44'/505' => m/44'/505'/0'
    // Go index by index and fill default values where needed
    defaultPathArray.forEach((defaultValue, index) => {
      const partialValue = partialHdPathArray[index];
      // If the partial array doesn't have a value at the index, get it from default
      if (partialValue === undefined || partialValue === '' || partialValue === null) completedHdPathArray[index] = defaultValue;
    });
  }
  // If a user passed in an addressIndex, use it in the addressIndex slot
  if (addressIndex) completedHdPathArray[5] = addressIndex;
  // When a child path is requested, we need to only return the difference
  if (child) {
    // mainnet: partialHdPath: m/44'/505'/0', completedHdPath: m/44'/505'/0'/0/0, childHdPath: 0/0
    // mainnet: partialHdPath: m/44'/1'/0', completedHdPath: m/44'/1'/0'/0/0', childHdPath: 0/0'
    const childPathArray = completedHdPathArray.splice(partialLength);
    // Turn the array into a combined hdPath string and return it
    return childPathArray.join('/');
  }
  // Turn the array into a combined hdPath string
  const completedHdPath = completedHdPathArray.join('/');
  // Return the full hdPath
  return completedHdPath;
};
