import { HDPathData, AccountPrefix, AccountLevel } from 'types';
import {
  ADDRESS_PREFIX_MAINNET,
  MAINNET_NETWORK,
  TESTNET_WALLET_COIN_TYPE,
  ADDRESS_PREFIX_TESTNET,
  TESTNET_NETWORK,
} from 'consts';

export const getHDPathData = (hdPath?: string): HDPathData => {
  // If there is no hdPath, or just 'm' is passed in return root account HD path data
  if (!hdPath || hdPath === 'm')
    return {
      accountLevel: 'root',
      root: { value: 'm', display: 'm', hardened: false },
      network: { prefix: ADDRESS_PREFIX_MAINNET, value: MAINNET_NETWORK },
    };
  // Full path example: "m/44'/1'/0'/0'/0'"
  // Path values: root/purpose/coin_type/account/change/address_index
  const pathValues = [
    'root',
    'purpose',
    'coinType',
    'account',
    'change',
    'addressIndex',
  ];
  const splitPath = hdPath.split('/');
  const finalData = {} as HDPathData;
  // Loop through each path value and build results
  splitPath.forEach((rawValue: string, index: number) => {
    const pathName = pathValues[index];
    if (
      pathName === 'root' ||
      pathName === 'purpose' ||
      pathName === 'coinType' ||
      pathName === 'account' ||
      pathName === 'change' ||
      pathName === 'addressIndex'
    ) {
      finalData[pathName] = {
        value: rawValue.includes('m') ? 'm' : Number(rawValue.split("'")[0]),
        hardened: rawValue.includes("'"),
        display: rawValue,
      };
    }
  });
  finalData.accountLevel = pathValues[splitPath.length - 1] as AccountLevel;
  // Default prefix is mainnet
  let prefix = ADDRESS_PREFIX_MAINNET as AccountPrefix;
  // Check for testnet prefix
  if (
    finalData.coinType?.value &&
    finalData.coinType.value === TESTNET_WALLET_COIN_TYPE
  )
    prefix = ADDRESS_PREFIX_TESTNET as AccountPrefix;
  // Determine the network based on the prefix
  const network =
    prefix === ADDRESS_PREFIX_TESTNET ? TESTNET_NETWORK : MAINNET_NETWORK;
  finalData.network = {
    prefix,
    value: network,
  };
  return finalData;
};
