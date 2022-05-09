import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import WalletConnectClient from "@walletconnect/client";
import { IWalletConnectSession } from 'types';

  /*
    accounts: [{publicKey: "AhvpNkkAMe3gnHdOE5AGt7owAeEOcMtCGU5ijdKibF1E",…}]
    bridge: "wss://test.figure.tech/service-wallet-connect-bridge/ws/external"
    chainId: "pio-testnet-1"
    clientId: "c3ce885a-f6d4-4864-8fc8-dd6530e817f4"
    clientMeta: {description: "Provenance Blockchain Wallet",…}
    connected: true
    handshakeId: 1651610471180288
    handshakeTopic: "197b54cf-b057-4995-8081-1c516ddb5ecd"
    key: "c82feac662f7c68e61aa536bc74803bc499b3c48dc5b6abbbb57fad7ce819f57"
    peerId: "2bc7aa85-d957-4a13-9960-06c9b491382b"
    peerMeta: {description: "Provenance.io | WalletConnect-JS Web Demo", url: "http://localhost:3000",…}
  */


/**
 * TYPES
 */

interface State {
  connector: WalletConnectClient | null,
  session: IWalletConnectSession,
}

/**
 * STATE
 */
const initialState: State = {
  connector: null,
  session: {
    accounts: [],
    bridge: '',
    chainId: -1,
    clientId: '',
    clientMeta: null,
    connected: false,
    handshakeId: 0,
    handshakeTopic: '',
    key: '',
    peerId: '',
    peerMeta: null,
  },
};

/**
 * SLICE
 */
const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    createConnector: (state, { payload: uri }) => {
      const connector = new WalletConnectClient({ uri });
      state.connector = connector;
    },
    setSession: (state, { payload: session }) => {
      const connector = new WalletConnectClient(session);
      state.connector = connector;
      state.session = session;
    }
  },
});

/**
 * ACTIONS
 */
export const walletConnectActions = walletConnectSlice.actions;

/**
 * SELECTORS
 */
export const selectWalletConnect = (state: RootState) => state.walletConnect;

export default walletConnectSlice.reducer;
