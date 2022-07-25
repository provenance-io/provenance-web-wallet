import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import addressReducer from './features/address/addressSlice';
import devToolsEnhancer from 'remote-redux-devtools';
import messageReducer from './features/message/messageSlice';
import pricingReducer from './features/pricing/pricingSlice';
import settingsReducer from './features/settings/settingsSlice';
import statisticsReducer from './features/statistics/statisticsSlice';
import walletConnectReducer from './features/walletConnect/walletConnectSlice';

export const store = configureStore({
  ...(process.env.REACT_APP_ENV === 'staging' && {
    enhancers: [devToolsEnhancer({ realtime: true, port: 8000 })],
  }),
  devTools: false,
  reducer: {
    account: accountReducer,
    api_address: addressReducer,
    api_pricing: pricingReducer,
    api_statistics: statisticsReducer,
    message: messageReducer,
    settings: settingsReducer,
    walletConnect: walletConnectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: ['walletConnect/createConnector'],
      // }
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
