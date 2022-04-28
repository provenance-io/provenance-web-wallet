import WalletConnect from "@walletconnect/client";

export type WalletConnectClient = WalletConnect;

export type IClientMeta = {
  description: string;
  url: string;
  icons: string[];
  name: string;
}

export type ConnectionEventPayload = {
  publicKey: string,
  address: string,
  jwt: string,
  walletInfo: {
    id: string,
    name: string,
    coin: string,
  }
}[];

export interface ISessionStatus {
  chainId: number | string;
  accounts: ConnectionEventPayload;
  networkId?: number;
  rpcUrl?: string;
}

export interface State {
  connected: boolean,
  connectionTimeout: number,
  connectionIat: number | null,
  connectionEat: number | null,
  connector: WalletConnectClient | null,
  peer: IClientMeta | null,
  uri: string | null,
}

export type SetState = (state: Partial<State>) => void;
export type SetFullState = (state:State) => void;

export type URI = string;
