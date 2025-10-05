import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
import reportFilterReducer from './reportFilterSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer,
    reportFilter: reportFilterReducer,
  },
});

// Infer type cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
