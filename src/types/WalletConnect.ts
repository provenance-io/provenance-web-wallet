import WalletConnect from "@walletconnect/client";

export type WalletConnectClient = WalletConnect;

export type IClientMeta = {
  description: string;
  url: string;
  icons: string[];
  name: string;
}

export type EventPayload = {
  id: number,
  jsonrpc: string,
  params: {
    peerMeta?: IClientMeta,
  }[]
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

export interface IWalletConnectSession {
  accounts?: ConnectionEventPayload;
  bridge?: string;
  chainId?: number | string;
  clientId?: string;
  clientMeta?: IClientMeta | null;
  connected?: boolean;
  handshakeId?: number;
  handshakeTopic?: string;
  key?: string;
  peerId?: string;
  peerMeta?: IClientMeta | null;
}
