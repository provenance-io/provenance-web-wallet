import {
  seed,
  allAccountNetworkLevels,
  allHDPathData,
} from './hdPath.consts';

import {
  getHDPathData,
  createRootAccount,
  createChildAccount,
  createWalletFromMasterKey,
} from 'utils';

// --------------------------------------------------
// Create new accounts at each possible HD level
// --------------------------------------------------
describe('Create new accounts at each possible HD level', () => {
  Object.keys(allAccountNetworkLevels).forEach(network => {
    const allAccountLevels = allAccountNetworkLevels[network];
    Object.keys(allAccountLevels).forEach(accountLevel => {
      const {
        hdPath,
        address: knownAddress,
        publicKey: knownPublicKey,
        privateKey: knownPrivateKey,
        masterKey: knownMasterKey,
      } = allAccountLevels[accountLevel];
      test(`creates a ${accountLevel} level account (${network})`, () => {
        const { address, privateKey, publicKey, masterKey } = createRootAccount(seed, hdPath);
        expect(address).toBe(knownAddress);
        expect(privateKey).toBe(knownPrivateKey);
        expect(publicKey).toBe(knownPublicKey);
        expect(masterKey).toBe(knownMasterKey);
      });
    });
  })
});

// -----------------------------------------------------------------
// Using each account level b64 privateKey, create child account
// -----------------------------------------------------------------
describe('Using each account level b64 masterKey, create child account', () => {
  Object.keys(allAccountNetworkLevels).forEach(network => {
    const allAccountLevels = allAccountNetworkLevels[network];
    Object.keys(allAccountLevels).forEach(accountLevel => {
      // If this is an addressIndex level account, it cannot make child accounts
      if (accountLevel !== 'addressIndex') {
        test(`${accountLevel} level parent (${network}) account creates addressIndex level child account`, () => {
          // Get known values from the addressIndexLevelData
          const {childHdPath, hdPath: parentHdPath, masterKey: parentMasterKey, network: parentNetwork} = allAccountLevels[accountLevel]
          const {
            address: knownAddress,
            publicKey: knownPublicKey,
            privateKey: knownPrivateKey,
            masterKey: knownMasterKey,
          } = allAccountNetworkLevels[parentNetwork].addressIndex;
          const { address, publicKey, privateKey, masterKey } = createChildAccount(parentMasterKey, parentHdPath, childHdPath);
          // Expect all the values to look like the addressIndex account (which is "m/44'/1'/0'/0'/0'" or "m/44'/505'/0'/0'/0'")
          expect(address).toBe(knownAddress);
          expect(privateKey).toBe(knownPrivateKey);
          expect(publicKey).toBe(knownPublicKey);
          expect(masterKey).toBe(knownMasterKey);
        });
      };
    });
  });
});

// ---------------------------------------------------------------
// Using each account masterKey, get other account information
// ---------------------------------------------------------------
describe('Using each account masterKey, get other account information', () => {
  Object.keys(allAccountNetworkLevels).forEach(network => {
    const allAccountLevels = allAccountNetworkLevels[network];
    Object.keys(allAccountLevels).forEach(accountLevel => {
      const targetAccount = allAccountLevels[accountLevel];
      const {
        publicKey: knownPublicKey,
        privateKey: knownPrivateKey,
        masterKey: knownMasterKey,
        address: knownAddress,
        network: knownNetwork,
      } = targetAccount;
      const { publicKeyB64, privateKeyB64, address } = createWalletFromMasterKey(knownMasterKey, knownNetwork);
      test(`${accountLevel} level (${network}) masterKey creates valid account information`, () => {
        expect(privateKeyB64).toBe(knownPrivateKey);
        expect(publicKeyB64).toBe(knownPublicKey);
        expect(address).toBe(knownAddress);
      })
    });
  });
});

// ------------------------
// Test HD Path rendering
// ------------------------
describe('Test HD Path rendering', () => {
  const allHDPathsToTest = {
    root: getHDPathData("m"),
    purpose: getHDPathData("m/44'"),
    coinType: getHDPathData("m/44'/1'"),
    account: getHDPathData("m/44'/1'/0'"),
    change: getHDPathData("m/44'/1'/0'/0'"),
    addressIndex: getHDPathData("m/44'/1'/0'/0'/0'"),
  };
  // Loop through each path type/account level and test for match
  Object.keys(allHDPathsToTest).forEach(level => {
    test(`HDPath data for ${level} account level is correctly generated`, () => {
      expect(allHDPathsToTest[level]).toEqual(allHDPathData[level]);
    })
  });
});
