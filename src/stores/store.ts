import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
import floatingWindowReducer from './floatingWindowSlice'; // ✅ thêm dòng này

export const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer,
    floatingWindow: floatingWindowReducer, // ✅ thêm reducer vào đây
  },
});

// ✅ Infer type cho RootState và AppDispatch (chuẩn TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
