import React, { createContext, useContext, useEffect, useState, ReactElement } from 'react';
import { State } from 'types';
import { WalletConnectService } from './walletConnectService';

interface ProviderState {
  walletConnectService: WalletConnectService,
  walletConnectState: State
}

const StateContext = createContext<ProviderState | undefined>(undefined);
const walletConnectService = new WalletConnectService();

interface Props {
  children: ReactElement,
  network?: 'testnet' | 'mainnet',
  bridge?: string,
  timeout?: number,
}

const WalletConnectContextProvider:React.FC<Props> = ({ children, network, bridge, timeout }) => {
  const [walletConnectState, setWalletConnectState] = useState<State>({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StateContext.Provider value={{ walletConnectService, walletConnectState }}>
      {children}
    </StateContext.Provider>
  );
};

const useWalletConnect = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useWalletConnect must be used within a WalletConnectContextProvider');
  }
  return context;
};

export { WalletConnectContextProvider, useWalletConnect };
