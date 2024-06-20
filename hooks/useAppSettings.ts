import { useCallback } from "react";
import {
  addFirstLoadedScreenName,
  selectAppSettings,
  setExploreActivatedViewName,
} from "~/features/appSettingsSlice";
import type { ExploreActivatedViewName } from "~/features/appSettingsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useAppSettings() {
  const dispatch = useAppDispatch();
  const { firstLoadedScreenNames, exploreActivatedViewName } =
    useAppSelector(selectAppSettings);

  const addFirstLoadedScreenNameAction = useCallback((screenName: string) => {
    dispatch(addFirstLoadedScreenName(screenName));
  }, []);

  const setExploreActivatedViewNameAction = useCallback(
    (viewName: ExploreActivatedViewName) => {
      dispatch(setExploreActivatedViewName(viewName));
    },
    [],
  );

  return {
    firstLoadedScreenNames,
    exploreActivatedViewName,
    addFirstLoadedScreenName: addFirstLoadedScreenNameAction,
    setExploreActivatedViewName: setExploreActivatedViewNameAction,
  };
}
