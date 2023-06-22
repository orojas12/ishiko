import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Project } from "../types";

export const currentProjectSlice = createSlice({
  name: "currentProject",
  initialState: {} as Project,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.owner = action.payload.owner;
    },
  },
});

export const { setCurrentProject } = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
