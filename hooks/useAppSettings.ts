import { useCallback } from "react";
import {
  addFirstLoadedScreenName,
  selectAppSettings,
  setExploreActivatedViewName,
  setOpenExploreCastMenu,
} from "~/features/appSettingsSlice";
import type { ExploreActivatedViewName } from "~/features/appSettingsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppSettings() {
  const dispatch = useAppDispatch();
  const {
    firstLoadedScreenNames,
    exploreActivatedViewName,
    openExploreCastMenu,
  } = useAppSelector(selectAppSettings);

  const addFirstLoadedScreenNameAction = useCallback((screenName: string) => {
    dispatch(addFirstLoadedScreenName(screenName));
  }, []);

  const setExploreActivatedViewNameAction = useCallback(
    (viewName: ExploreActivatedViewName) => {
      dispatch(setExploreActivatedViewName(viewName));
    },
    [],
  );

  const setOpenExploreCastMenuAction = useCallback((open: boolean) => {
    dispatch(setOpenExploreCastMenu(open));
  }, []);

  return {
    firstLoadedScreenNames,
    exploreActivatedViewName,
    openExploreCastMenu,
    addFirstLoadedScreenName: addFirstLoadedScreenNameAction,
    setExploreActivatedViewName: setExploreActivatedViewNameAction,
    setOpenExploreCastMenu: setOpenExploreCastMenuAction,
  };
}
