import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import devToolsEnhancer from "remote-redux-devtools";
import addressReducer from './features/address/addressSlice';
import pricingReducer from './features/pricing/pricingSlice';
import statisticsReducer from './features/statistics/statisticsSlice';
import accountReducer from './features/account/accountSlice';
import walletConnectReducer from './features/walletConnect/walletConnectSlice';
import settingsReducer from './features/settings/settingsSlice';

export const store = configureStore({
  ...(process.env.REACT_APP_ENV === "staging") && {enhancers: [devToolsEnhancer({ realtime: true, port: 8000 })]},
  devTools: false,
  reducer: {
    api_address: addressReducer,
    api_pricing: pricingReducer,
    api_statistics: statisticsReducer,
    account: accountReducer,
    walletConnect: walletConnectReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    // serializableCheck: {
    //   // Ignore these action types
    //   ignoredActions: ['walletConnect/createConnector'],
    // }
  })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
