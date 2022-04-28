import { State, SetFullState, URI, SetState } from 'types';
import { CONNECTION_TIMEOUT } from 'consts';
import {
  createConnection as createConnectionMethod,
} from './methods';
// Check for existing values from localStorage
// const existingWCState:WalletConnectClient = getFromLocalStorage('walletconnect');

const defaultState: State = {
  connected: false,
  connectionTimeout: CONNECTION_TIMEOUT,
  connectionIat: null,
  connectionEat: null,
  connector: null,
  peer: null,
};

const initialState: State = {
  connected: defaultState.connected,
  connectionTimeout: CONNECTION_TIMEOUT,
  connectionIat: null,
  connectionEat: null,
  connector: defaultState.connector,
  peer: defaultState.peer,
};

export class WalletConnectService {
  #setWalletConnectState: SetFullState | undefined = undefined;
  state: State = { ...initialState };

  setState: SetState = (updatedState) => {
    // Loop through each to update
    this.state =  {...this.state, ...updatedState};
    this.updateState();
  };

  updateState(): void {
    if (this.#setWalletConnectState) {
      this.#setWalletConnectState({
        ...this.state,
      });
    }
  }

  setStateUpdater(setWalletConnectState: SetFullState): void {
    this.#setWalletConnectState = setWalletConnectState;
  }

  createConnection(data: URI) {
    createConnectionMethod({
      setState: this.setState,
      uri: data,
    });
  }
}