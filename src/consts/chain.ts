export const CHAINID_MAINNET = 'pio-mainnet-1' as const;
export const CHAINID_TESTNET = 'pio-testnet-1' as const;
export const PROVENANCE_WALLET_COIN_TYPE = 505 as const;
export const TESTNET_WALLET_COIN_TYPE = 1 as const;
export const MAINNET_NETWORK = 'mainnet' as const;
export const TESTNET_NETWORK = 'testnet' as const;
export const ADDRESS_PREFIX_MAINNET = 'pb' as const;
export const ADDRESS_PREFIX_TESTNET = 'tp' as const;
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK;
export const DEFAULT_MAINNET_HD_PATH = `m/44'/${PROVENANCE_WALLET_COIN_TYPE}'/0'/0/0`; // m/44'/505'/0'/0/0 (addressIndex level)
export const DEFAULT_TESTNET_HD_PATH = `m/44'/${TESTNET_WALLET_COIN_TYPE}'/0'/0/0'`; // m/44'/1'/0'/0/0' (addressIndex level)
export const MNEMONIC_WORD_COUNT = 24 as const;
export const HD_PATH_KEYS = [
  'root',
  'purpose',
  'coinType',
  'account',
  'change',
  'addressIndex',
] as const;
export const DEFAULT_GAS_ADJUSTMENT = '1.25';

export const TEST_WALLET =
  'bleak alpha bunker give message direct powder general issue awesome animal ice entry parade invest sausage tragic away nuclear gaze learn during crew benefit'; // tp1knsxfnn0lq48mmnkfnkgtkk8qnxxdu0y2tklkh
