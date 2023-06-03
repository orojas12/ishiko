import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { currentProjectReducer } from "@/modules/projects";
import { ishikoApi } from "@/services";

export const store = configureStore({
  reducer: {
    currentProject: currentProjectReducer,
    [ishikoApi.reducerPath]: ishikoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ishikoApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
