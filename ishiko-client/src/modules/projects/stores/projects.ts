import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: "" as string | undefined,
  reducers: {
    setCurrent: (state, action: PayloadAction<string | undefined>) => {
      state = action.payload;
    },
  },
});

export const { setCurrent } = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
