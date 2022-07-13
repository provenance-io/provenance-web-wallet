import { txMessageFormat } from 'utils';

const testData = [
  // sendCoin
  {
    txMessageType: 'sendCoin/sendHash',
    fromAddress: 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh',
    toAddress: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4',
    amountList: [ { denom: 'nhash', amount: '10000000000' }],
    result: {
      toAddress: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4',
      fromAddress: 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh',
      amountList: {
        denom: 'nhash',
        amount: '10000000000',
      }
    },
  },
  // Custom Tests
  {
    txMessageType: 'customTest 01',
    fromAddress: 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh',
    toAddress: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4',
    amountList: [ { denom: 'nhash', amount: '10000000000' }, { denom: 'eth', amount: '300' }, { denom: 'btc', amount: '2' }],
    result: {
      toAddress: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4',
      fromAddress: 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh',
      'amountList 1': {
        denom: 'nhash',
        amount: '10000000000',
      },
      'amountList 2': {
        denom: 'eth',
        amount: '300',
      },
      'amountList 3': {
        denom: 'btc',
        amount: '2',
      },
    },
  }
];

// ---------------------------------------------------------------
// Test various words to see if they are properly capitalized
// ---------------------------------------------------------------
describe('Format a raw tx message to a structured display message', () => {
  testData.forEach(({ txMessageType, result, ...rawMessage }) => {
    test(`format "${txMessageType}" message`, () => {
      expect(txMessageFormat(rawMessage)).toStrictEqual(result);
    })
  });
});