import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from './useStore';
import {
  selectWalletConnect as selector,
  walletConnectActions as actionsList,
} from '../features/walletConnect/walletConnectSlice';

export const useWalletConnect = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selector);
  const actions = useMemo(
    () => bindActionCreators(actionsList, dispatch),
    [dispatch]
  );

  return { ...state, ...actions };
};
