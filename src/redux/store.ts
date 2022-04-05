import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import addressReducer from './features/address/addressSlice';
import genericReducer from './features/generic/genericSlice';

export const store = configureStore({
  reducer: {
    address: addressReducer,
    generic: genericReducer,
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
