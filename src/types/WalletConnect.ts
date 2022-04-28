import WalletConnect from "@walletconnect/client";

export type WalletConnectClient = WalletConnect;

export type IClientMeta = {
  description: string;
  url: string;
  icons: string[];
  name: string;
}

export interface State {
  connected: boolean,
  connectionTimeout: number,
  connectionIat: number | null,
  connectionEat: number | null,
  connector: WalletConnectClient | null,
  peer: IClientMeta | null,
}

export type SetState = (state: Partial<State>) => void;
export type SetFullState = (state:State) => void;

export type URI = string;
