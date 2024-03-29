import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import assetChartReducer from './features/assetChart/assetChartSlice';
import devToolsEnhancer from 'remote-redux-devtools';
import messageReducer from './features/message/messageSlice';
import settingsReducer from './features/settings/settingsSlice';
import walletConnectReducer from './features/walletConnect/walletConnectSlice';
import { assetsApi, statisticsApi, transactionsApi, markerApi } from './services';

const rootReducer = combineReducers({
  account: accountReducer,
  assetChart: assetChartReducer,
  message: messageReducer,
  settings: settingsReducer,
  walletConnect: walletConnectReducer,
  [statisticsApi.reducerPath]: statisticsApi.reducer,
  [assetsApi.reducerPath]: assetsApi.reducer,
  [transactionsApi.reducerPath]: transactionsApi.reducer,
  [markerApi.reducerPath]: markerApi.reducer,
});

export const store = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    ...(process.env.REACT_APP_ENV === 'staging' && {
      enhancers: [devToolsEnhancer({ realtime: true, port: 8000 })],
    }),
    devTools: process.env.REACT_APP_ENV === 'local',
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        // serializableCheck: {
        //   // Ignore these action types
        //   ignoredActions: ['walletConnect/createConnector'],
        // }
      }).concat(
        statisticsApi.middleware,
        assetsApi.middleware,
        transactionsApi.middleware,
        markerApi.middleware
      ),
    preloadedState,
  });

export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
