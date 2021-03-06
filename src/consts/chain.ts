export const CHAINID_MAINNET = 'pio-mainnet-1' as const;
export const CHAINID_TESTNET = 'pio-testnet-1' as const;
export const PROVENANCE_WALLET_COIN_TYPE = 505 as const;
export const TESTNET_WALLET_COIN_TYPE = 1 as const;
export const MAINNET_NETWORK = 'mainnet' as const;
export const TESTNET_NETWORK = 'testnet' as const;
export const ADDRESS_PREFIX_MAINNET = 'pb' as const;
export const ADDRESS_PREFIX_TESTNET = 'tp' as const;
export const DEFAULT_NETWORK = MAINNET_NETWORK;
export const DEFAULT_MAINNET_HD_PATH = `m/44'/${PROVENANCE_WALLET_COIN_TYPE}'/0'/0/0`; // m/44'/505'/0'/0/0 (addressIndex level)
export const DEFAULT_TESTNET_HD_PATH = `m/44'/${TESTNET_WALLET_COIN_TYPE}'/0'/0/0'`; // m/44'/1'/0'/0/0' (addressIndex level)
export const MNEMONIC_WORD_COUNT = 24 as const;
export const HD_PATH_KEYS = ['root', 'purpose', 'coinType', 'account', 'change', 'addressIndex'] as const;
