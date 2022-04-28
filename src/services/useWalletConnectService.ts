import { useEffect, useRef, useState } from 'react'; // eslint-disable-line import/no-extraneous-dependencies, no-unused-vars
import { WalletConnectService } from './walletConnectService';

export const useWalletConnectService = () => {
  const walletConnectService = useRef(new WalletConnectService()).current // Note: Why does wallet-lib use "useRef" here?
  const [walletConnectState, setWalletConnectState] = useState({ ...walletConnectService.state });

  useEffect(() => {
    walletConnectService.setStateUpdater(setWalletConnectState); // Whenever we change the react state, update the class state
  }, [walletConnectService]);

  return { walletConnectState, walletConnectService };
};
