
export type AccountLevel = 'root' | 'purpose' | 'coinType' | 'account' | 'change' | 'addressIndex';
export type AccountNetwork = 'testnet' | 'mainnet';
export type AccountPrefix = 'pb' | 'tp';

export interface Account {
  name?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
  network?: AccountNetwork,
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

export interface HDPathItem {
  value: number | string,
  hardened: boolean,
  display: string,
}
interface HDPathNetwork {
  value: AccountNetwork,
  prefix: AccountPrefix,
}
export interface HDPathData {
  accountLevel: AccountLevel,
  root?: HDPathItem,
  purpose?: HDPathItem,
  coinType?: HDPathItem,
  account?: HDPathItem,
  change?: HDPathItem,
  addressIndex?: HDPathItem,
  network: HDPathNetwork,
}