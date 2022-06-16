
export type AccountLevel = 'root' | 'purpose' | 'coinType' | 'account' | 'change' | 'addressIndex';

export interface Account {
  name?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
  network?: 'testnet' | 'mainnet',
  accountLevel?: AccountLevel,
  masterKey?: string,
  hdPath?: string,
};

export type AccountAddress = string;
export type Key = string;

export interface AccountStorage {
  accounts?: Account[],
  activeAccountId?: AccountAddress,
  key?: Key, 
}

export interface CustomDerivationPathObject {
  account?: number,
  change?: number,
  addressIndex?: number,
  coin_type?: number,
}

interface HDPathItem {
  value: number | string,
  hardened: boolean,
  display: string,
}
export interface HDPathData {
  accountLevel: AccountLevel,
  root?: HDPathItem,
  purpose?: HDPathItem,
  coinType?: HDPathItem,
  account?: HDPathItem,
  change?: HDPathItem,
  addressIndex?: HDPathItem,
}