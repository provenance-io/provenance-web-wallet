import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from './useStore';
import {
  selectAssetChart as selector,
  assetChartActions as actionsList,
} from '../features/assetChart/assetChartSlice';

export const useAssetChart = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selector);
  const actions = useMemo(
    () => bindActionCreators(actionsList, dispatch),
    [dispatch]
  );

  return { ...state, ...actions };
};
