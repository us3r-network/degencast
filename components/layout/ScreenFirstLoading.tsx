import { ScreenLoading } from "~/components/common/Loading";
import useFirstLoadedScreenListener from "~/hooks/useFirstLoadedScreenListener";

export default function ScreenFirstLoading() {
  const { currRouteFirstLoaded } = useFirstLoadedScreenListener();
  return !currRouteFirstLoaded ? (
    <ScreenLoading className=" fixed left-1/2 top-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2" />
  ) : null;
}
