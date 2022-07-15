import {
  CHAINID_MAINNET,
  CHAINID_TESTNET,
  ADDRESS_PREFIX_TESTNET,
} from 'consts';

// Based on the wallet address, return back the chainId it belongs to
export const getChainId = (address: string) => address.startsWith(ADDRESS_PREFIX_TESTNET) ? CHAINID_TESTNET : CHAINID_MAINNET
