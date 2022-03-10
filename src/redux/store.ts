import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import genericReducer from './features/generic/genericSlice';

export const store = configureStore({
  reducer: {
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
