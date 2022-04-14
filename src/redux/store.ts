import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import addressReducer from './features/address/addressSlice';
import genericReducer from './features/generic/genericSlice';
import pricingReducer from './features/pricing/pricingSlice';
import statisticsReducer from './features/statistics/statisticsSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    generic: genericReducer,
    pricing: pricingReducer,
    statistics: statisticsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
