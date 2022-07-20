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
  method?: string,
  date?: number,
  session?: WalletConnectClient | null,
  params: {
    peerMeta?: IClientMeta,
  }[]
}

export type SavedPendingRequests = {
  [id: string]: EventPayload,
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

export interface WalletConnectStorage { // WalletConnect session data
  connectionEST?: number, // When did we connect with walletconnect
  connectionEXP?: number, // When are we predicted to expire (actions refresh EST time)
  connectionDuration?: number, // How long from EST to EXP
  pendingRequests?: SavedPendingRequests,
  totalPendingRequests?: number,
}

export type WCNotification =
  'connect' |
  'disconnect' |
  'session_request' |
  'provenance_sign' |
  'provenance_sendTransaction' |
  '';
