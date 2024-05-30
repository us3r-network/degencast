import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/store/store";

type AppSettingsState = {
  firstLoadedScreenNames: string[];
};

const appSettingsState: AppSettingsState = {
  firstLoadedScreenNames: [],
};

export const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState: appSettingsState,
  reducers: {
    addFirstLoadedScreenName: (state, action: PayloadAction<string>) => {
      if (!state.firstLoadedScreenNames.includes(action.payload)) {
        state.firstLoadedScreenNames.push(action.payload);
      }
    },
  },
});

const { actions, reducer } = appSettingsSlice;
export const { addFirstLoadedScreenName } = actions;
export const selectAppSettings = (state: RootState) => state.appSettings;
export default reducer;
