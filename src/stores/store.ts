import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer
  },
});

// Infer type cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
