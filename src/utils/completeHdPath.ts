import { DEFAULT_MAINNET_HD_PATH } from 'consts';

// Tests for this util live here: src/__tests__/completeHdPath.test.js

// Complete a partial hd path all the way down to account index
// Allow user to pass in addressIndex (as string, which will allow them to harden/unharded if needed)
export const completeHdPath = (partialHdPath: string, addressIndex: string = "0'", child?: boolean): string => {
  // partialHdPath: m/44'/505'/0' => finalHdPath: m/44'/505'/0'/0'/0'
  // If we are looking for a child, we are going to return the difference: eg: partialHdPath: m/44'/505'/0' => finalHdPath: 0'/0'
  // Full hdPath to addressIndex length is 6
  const fullHdPathLength = 6;
  // hdPath array and each items index: [root(0), purpose(1), coinType(2), account(3), change(4), addressIndex(5)]
  const partialHdPathArray = partialHdPath.split('/');
  const partialLength = partialHdPathArray.length;
  // Already full length (or some wierd long length - just return what they passed in)
  if (partialLength >= fullHdPathLength) return partialHdPath;
  const defaultMainnetPathArray = DEFAULT_MAINNET_HD_PATH.split('/');
  const defaultLength = defaultMainnetPathArray.length;
  // Copy the partial path array to make edits to it
  let completedHdPathArray = partialHdPathArray;
  // If the partial length is less than the default length, we need to use default fill in values from DEFAULT_MAINNET_HD_PATH
  if (partialLength < defaultLength) { // eg: m/44'/505' => m/44'/505'/0'
    // Go index by index and fill default values where needed
    defaultMainnetPathArray.forEach((defaultValue, index) => {
      const partialValue = partialHdPathArray[index];
      // If the partial array doesn't have a value at the index, get it from default
      if (partialValue === undefined || partialValue === '' || partialValue === null) completedHdPathArray[index] = defaultValue;
    });
  }
  // Possible remaining missing items (after cross-checking over default) can only be 'change' and 'addressIndex'.  Add those as needed
  // Change is position (4) - Change default is "0'"
  if (completedHdPathArray[4] === undefined) completedHdPathArray[4] = "0'";
  // AddressIndex is position (5) - AddressIndex default is "0'", but user might pass in their own value
  const fillInAddressIndexValue = (addressIndex !== undefined) ? addressIndex : "0'";
  if (completedHdPathArray[5] === undefined) completedHdPathArray[5] = fillInAddressIndexValue;
  // When a child path is requested, we need to only return the difference
  if (child) {
    // partialHdPath: m/44'/505'/0', completedHdPath: m/44'/505'/0'/0'/0', childHdPath: 0'/0'
    const childPathArray = completedHdPathArray.splice(partialLength);
    // Turn the array into a combined hdPath string and return it
    return childPathArray.join('/');
  }
  // Turn the array into a combined hdPath string
  const completedHdPath = completedHdPathArray.join('/');
  // Return the full hdPath
  return completedHdPath;
};
