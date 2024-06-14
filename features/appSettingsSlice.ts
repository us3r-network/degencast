import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/store/store";

type AppSettingsState = {
  firstLoadedScreenNames: string[];
  openExploreCastMenu: boolean;
};

const appSettingsState: AppSettingsState = {
  firstLoadedScreenNames: [],
  openExploreCastMenu: false,
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
    setOpenExploreCastMenu: (state, action: PayloadAction<boolean>) => {
      state.openExploreCastMenu = action.payload;
    },
  },
});

const { actions, reducer } = appSettingsSlice;
export const { addFirstLoadedScreenName, setOpenExploreCastMenu } = actions;
export const selectAppSettings = (state: RootState) => state.appSettings;
export default reducer;
