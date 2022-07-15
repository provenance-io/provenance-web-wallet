import { CHAINID_MAINNET, CHAINID_TESTNET } from 'consts';
import { getChainId } from 'utils';

const testData = [
  { address: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4', result: CHAINID_TESTNET },
  { address: 'pb1grxskh6mlkt488wgnhqmaymdguyp5exnyjd40a', result: CHAINID_MAINNET },
  { address: 'abcdefghijklmnopqrstuvwxyz012345678901234', result: CHAINID_MAINNET },
];

describe('Get the chainid based on address', () => {
  testData.forEach(({ address, result }) => {
    test(`chainid for "${address}"`, () => {
      expect(getChainId(address)).toStrictEqual(result);
    })
  });
});