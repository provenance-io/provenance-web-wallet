import { txMessageFormat } from 'utils';

const testData = [
  // sendCoin
  {
    txMessageType: 'MsgSend',
    toAddress: 'tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4',
    fromAddress: 'tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh',
    amountList: [ { denom: 'nhash', amount: '10000000000' }],
    result: {
      toAddress: 'tp1...xn49uvw4',
      fromAddress: 'tp1...0y2tklkh',
      amountList: '10 Hash',
    },
  },
  // addMarker
  {
    txMessageType: "MsgAddMarkerRequest",
    amount: { denom: "July13_01", amount: "1" },
    manager: "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
    fromAddress: "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
    status: 2,
    markerType: 1,
    accessListList: [
      {
        address: "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
        permissionsList: [6,2,1,3,4,5]
      }
    ],
    supplyFixed: true,
    allowGovernanceControl: false,
    result: {
      amount: '1 July13_01',
      manager: 'tp1...0y2tklkh',
      fromAddress: 'tp1...0y2tklkh',
      status: 2,
      markerType: 1,
      supplyFixed: true,
      allowGovernanceControl: false,
      accessListList: {
        address: "tp1...0y2tklkh",
        permissionsList: `6\n2\n1\n3\n4\n5`,
      },
    },
  },
  // Custom Tests
  {
    txMessageType: 'MsgCustom01',
    amountList: [ { denom: 'nhash', amount: '10000000000' }, { denom: 'ETH', amount: '300' }, { denom: 'BTC', amount: '2' }],
    result: { amountList: `10 Hash\n300 ETH\n2 BTC` },
  },
  {
    txMessageType: "MsgCustom02",
    accessListList: [
      {
        address: "tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh",
        permissionsList: [6,2,1,3,4,5]
      },
      {
        address: "tp1grxskh6mlkt488wgnhqmaymdguyp5exn49uvw4",
        permissionsList: [7,8,9]
      }
    ],
    result: {
      'accessListList 1': {
        address: "tp1...0y2tklkh",
        permissionsList: `6\n2\n1\n3\n4\n5`,
      },
      'accessListList 2': {
        address: "tp1...xn49uvw4",
        permissionsList: `7\n8\n9`,
      },
    },
  },
  {
    txMessageType: 'MsgCustom03',
    dataset: [ {data: 1}, {data: 2}, {data: 3}],
    result: {
      'dataset 1': { data: 1 },
      'dataset 2': { data: 2 },
      'dataset 3': { data: 3 },
    },
  },
  {
    txMessageType: 'MsgCustom04',
    dataObj: { data1: 1, data2: 2, data3: 3},
    result: { dataObj: { data1: 1, data2: 2, data3: 3 }},
  },
];

describe('Format a raw tx message to a structured display message', () => {
  testData.forEach(({ txMessageType, result, ...rawMessage }) => {
    test(`format "${txMessageType}" message`, () => {
      expect(txMessageFormat(rawMessage)).toStrictEqual(result);
    })
  });
});