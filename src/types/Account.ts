
export interface Account {
  name?: string,
  publicKey?: string,
  privateKey?: string,
  address?: string,
  network?: string,
  id?: number,
};

export type AccountIndex = number;
export type Key = string;

export interface AccountStorage {
  accounts?: Account[],
  activeAccountId?: AccountIndex,
  key?: Key, 
}

export interface CustomDerivationPathObject {
  account?: number,
  change?: number,
  addressIndex?: number,
  coin_type?: number,
}