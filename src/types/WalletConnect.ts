import type WalletConnect from '@walletconnect/client';

export type WalletConnectClient = WalletConnect;

export type IClientMeta = {
  description: string;
  address: string;
  date: number;
  gasPrice?: {
    gasPriceDenom: string;
    gasPrice: number;
  };
  url: string;
  icons: string[];
  name: string;
  message?: string;
  memo?: string;
  feePayer?: string;
  feeGranter?: string;
};

type BasicPayload = {
  id: number;
  jsonrpc: string;
  method: string;
};

export type EventPayload = BasicPayload & {
  date?: number;
  session?: WalletConnectClient | null;
  params: [string, string];
};

export type WCInitEventPayload = BasicPayload & {
  params: {
    chainId: string;
    peerId: string;
    peerMeta: {
      description: string;
      icons: string[];
      name: string;
      url: string;
      message?: string;
    };
  }[];
};

export type SavedPendingRequests = {
  [id: string]: EventPayload;
};

type ConnectionEventPayload = {
  publicKey: string;
  address: string;
  jwt: string;
  walletInfo: {
    id: string;
    name: string;
    coin: string;
  };
}[];

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

export interface WalletConnectStorage {
  // WalletConnect session data
  connectionEST?: number; // When did we connect with walletconnect
  connectionEXP?: number; // When are we predicted to expire (actions refresh EST time)
  connectionDuration?: number; // How long from EST to EXP
  pendingRequests?: SavedPendingRequests;
  totalPendingRequests?: number;
}

export type WCNotification =
  | 'connect'
  | 'disconnect'
  | 'session_request'
  | 'provenance_sign'
  | 'provenance_sendTransaction'
  | '';
