import { PropsWithChildren, useEffect } from "react";
import useUserAction from "~/hooks/user/useUserAction";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import useSeenCasts from "~/hooks/user/useSeenCasts";
import useAuth from "~/hooks/user/useAuth";

export default function StateUpdateWrapper({ children }: PropsWithChildren) {
  const { authenticated } = useAuth();

  // user action
  const { fetchUserActionConfig, submitUnreportedActions } = useUserAction();
  const { fetchTotalPoints } = useUserTotalPoints();

  const { submitUnreportedViewCasts } = useSeenCasts();

  useEffect(() => {
    fetchUserActionConfig();
  }, [fetchUserActionConfig]);

  useEffect(() => {
    (async () => {
      if (authenticated) {
        await submitUnreportedActions();
        await fetchTotalPoints();
      }
    })();
  }, [authenticated, fetchTotalPoints, submitUnreportedActions]);

  useEffect(() => {
    (async () => {
      if (authenticated) {
        submitUnreportedViewCasts();
      }
    })();
  }, [authenticated, submitUnreportedViewCasts]);

  return children;
}
