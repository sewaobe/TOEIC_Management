import { createSlice } from "@reduxjs/toolkit";

interface FabState {
    visible: boolean;
    mode: "global" | "dictation" | "vocab";
}

const initialState: FabState = {
    visible: true,
    mode: "global",
};

const fabSlice = createSlice({
    name: "fab",
    initialState,
    reducers: {
        showFab: (state) => { state.visible = true; },
        hideFab: (state) => { state.visible = false; },
    },
});

export const { showFab, hideFab } = fabSlice.actions;
export default fabSlice.reducer;
