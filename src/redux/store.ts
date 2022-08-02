import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import addressReducer from './features/address/addressSlice';
import devToolsEnhancer from 'remote-redux-devtools';
import messageReducer from './features/message/messageSlice';
import settingsReducer from './features/settings/settingsSlice';
import statisticsReducer from './features/statistics/statisticsSlice';
import walletConnectReducer from './features/walletConnect/walletConnectSlice';

const rootReducer = combineReducers({
  account: accountReducer,
  api_address: addressReducer,
  api_statistics: statisticsReducer,
  message: messageReducer,
  settings: settingsReducer,
  walletConnect: walletConnectReducer,
});

export const store = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    ...(process.env.REACT_APP_ENV === 'staging' && {
      enhancers: [devToolsEnhancer({ realtime: true, port: 8000 })],
    }),
    devTools: process.env.REACT_APP_ENV === 'development',
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        // serializableCheck: {
        //   // Ignore these action types
        //   ignoredActions: ['walletConnect/createConnector'],
        // }
      }),
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
