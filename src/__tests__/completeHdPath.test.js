import { completeHdPath } from 'utils';

const testItems = [
  // MAINNET:
  // AddressIndex 1
  { partialHdPath: "m", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/505'", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/505'/0'", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/505'/0'/0", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/505'/0'/0/1", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/505'/0'/0/1/0", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1/0", },
  // AddressIndex 1'
  { partialHdPath: "m", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'/505'", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'/505'/0'", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'/505'/0'/0", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'/505'/0'/0/1", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1", },
  // No AddressIndex
  { partialHdPath: "m/44'/505'/0'/0", expectedResult: "m/44'/505'/0'/0/0", },
  // TESTNET:
  // AddressIndex 1
  { partialHdPath: "m", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'", addressIndex: "1", expectedResult: "m/44'/505'/0'/0/1", },
  { partialHdPath: "m/44'/1'", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1", },
  { partialHdPath: "m/44'/1'/0'", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1", },
  { partialHdPath: "m/44'/1'/0'/0", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1", },
  { partialHdPath: "m/44'/1'/0'/0/1", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1", },
  { partialHdPath: "m/44'/1'/0'/0/1/0", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1/0", },
  // AddressIndex 1'
  { partialHdPath: "m", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'", addressIndex: "1'", expectedResult: "m/44'/505'/0'/0/1'", },
  { partialHdPath: "m/44'/1'", addressIndex: "1'", expectedResult: "m/44'/1'/0'/0/1'", },
  { partialHdPath: "m/44'/1'/0'", addressIndex: "1'", expectedResult: "m/44'/1'/0'/0/1'", },
  { partialHdPath: "m/44'/1'/0'/0", addressIndex: "1'", expectedResult: "m/44'/1'/0'/0/1'", },
  { partialHdPath: "m/44'/1'/0'/0/1'", addressIndex: "1", expectedResult: "m/44'/1'/0'/0/1'", },
  // No AddressIndex
  { partialHdPath: "m/44'/1'/0'/0", expectedResult: "m/44'/1'/0'/0/0'", },
  // Empty Path
  { partialHdPath: "", expectedResult: "m/44'/505'/0'/0/0", },
  // Test child values (returns partialPath)
  // MAINNET
  { partialHdPath: "m", child: true, expectedResult: "44'/505'/0'/0/0", },
  { partialHdPath: "m/44'", child: true, expectedResult: "505'/0'/0/0", },
  { partialHdPath: "m/44'/505'", child: true, expectedResult: "0'/0/0", },
  { partialHdPath: "m/44'/505'/0'", child: true, expectedResult: "0/0", },
  { partialHdPath: "m/44'/505'/0'/0", child: true, expectedResult: "0", },
  { partialHdPath: "m/44'/505'/0'/0/0", child: true, expectedResult: "m/44'/505'/0'/0/0", },
  { partialHdPath: "m/44'/505'/0'", addressIndex: "1'", child: true, expectedResult: "0/1'", },
  // TESTNET
  { partialHdPath: "m", child: true, expectedResult: "44'/505'/0'/0/0", },
  { partialHdPath: "m/44'", child: true, expectedResult: "505'/0'/0/0", },
  { partialHdPath: "m/44'/1'", child: true, expectedResult: "0'/0/0'", },
  { partialHdPath: "m/44'/1'/0'", child: true, expectedResult: "0/0'", },
  { partialHdPath: "m/44'/1'/0'/0", child: true, expectedResult: "0'", },
  { partialHdPath: "m/44'/1'/0'/0/0'", child: true, expectedResult: "m/44'/1'/0'/0/0'", },
  { partialHdPath: "m/44'/1'/0'", addressIndex: "1", child: true, expectedResult: "0/1", },
];

// -------------------------------------------------------------------
// Test various HDPaths to properly finish them to default values
// -------------------------------------------------------------------
describe('Finish a series of hdPaths to full or partial child addressIndex length', () => {
  testItems.forEach(({ partialHdPath, addressIndex, expectedResult, child }) => {
    test(`${child ?
      `partial child hdPath: "${partialHdPath}"` :
      `complete hdPath: "${partialHdPath}" w/${addressIndex ? `addressIndex: "${addressIndex}"`: 'o addressIndex'}`}`,
      () => {
        expect(completeHdPath(partialHdPath, addressIndex, child)).toBe(expectedResult);
      }
    )
  });
});

