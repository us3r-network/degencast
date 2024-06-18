import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/store/store";

export enum ExploreActivatedViewName {
  trending = "trending",
  following = "following",
  hosting = "hosting",
}

type AppSettingsState = {
  firstLoadedScreenNames: string[];
  openExploreCastMenu: boolean;
  exploreActivatedViewName: ExploreActivatedViewName;
};

const appSettingsState: AppSettingsState = {
  firstLoadedScreenNames: [],
  openExploreCastMenu: false,
  exploreActivatedViewName: ExploreActivatedViewName.trending,
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

    setExploreActivatedViewName: (
      state,
      action: PayloadAction<ExploreActivatedViewName>,
    ) => {
      state.exploreActivatedViewName = action.payload;
    },
  },
});

const { actions, reducer } = appSettingsSlice;
export const {
  addFirstLoadedScreenName,
  setOpenExploreCastMenu,
  setExploreActivatedViewName,
} = actions;
export const selectAppSettings = (state: RootState) => state.appSettings;
export default reducer;
