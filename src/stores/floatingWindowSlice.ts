import { createSlice } from "@reduxjs/toolkit";

interface FloatingWindowState {
  isVideoManagerOpen: boolean;
}

const initialState: FloatingWindowState = {
  isVideoManagerOpen: false,
};

const floatingWindowSlice = createSlice({
  name: "floatingWindow",
  initialState,
  reducers: {
    openVideoManager: (state) => {
      state.isVideoManagerOpen = true;
    },
    closeVideoManager: (state) => {
      state.isVideoManagerOpen = false;
    },
  },
});

export const { openVideoManager, closeVideoManager } = floatingWindowSlice.actions;
export default floatingWindowSlice.reducer;
