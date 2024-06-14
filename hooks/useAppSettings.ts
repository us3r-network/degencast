import { useCallback } from "react";
import {
  addFirstLoadedScreenName,
  selectAppSettings,
} from "~/features/appSettingsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useSeenCasts() {
  const dispatch = useAppDispatch();
  const { firstLoadedScreenNames } = useAppSelector(selectAppSettings);

  const addFirstLoadedScreenNameAction = useCallback((screenName: string) => {
    dispatch(addFirstLoadedScreenName(screenName));
  }, []);

  return {
    firstLoadedScreenNames,
    addFirstLoadedScreenName: addFirstLoadedScreenNameAction,
  };
}
