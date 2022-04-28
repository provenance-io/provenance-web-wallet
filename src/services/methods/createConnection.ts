import WalletConnectClient from "@walletconnect/client";
import { createEventListeners } from './createEventListeners';
import { SetState } from 'types';

interface Args {
  uri: string,
  setState: SetState,
}

export const createConnection = ({ uri, setState }: Args) => {
  const connector = new WalletConnectClient({ uri });
  createEventListeners(connector);
  setState({ connector });
};
