import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import useAppSettings from "./useAppSettings";

export default function useFirstLoadedScreenListener() {
  const route = useRoute();
  const name = route.name;
  const { addFirstLoadedScreenName, firstLoadedScreenNames } = useAppSettings();
  const routeFirstLoadedListener = useCallback(() => {
    addFirstLoadedScreenName(name);
  }, [name, addFirstLoadedScreenName]);
  const currRouteFirstLoaded = firstLoadedScreenNames.includes(name);
  return {
    currRouteFirstLoaded,
    routeFirstLoadedListener,
  };
}
