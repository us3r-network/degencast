import { PropsWithChildren, useEffect } from "react";
import useUserAction from "~/hooks/user/useUserAction";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import useSeenCasts from "~/hooks/user/useSeenCasts";
import useAuth from "~/hooks/user/useAuth";
import useAllJoinedCommunities from "~/hooks/community/useAllJoinedCommunities";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";

export default function StateUpdateWrapper({ children }: PropsWithChildren) {
  const { authenticated } = useAuth();

  // user action
  const { fetchUserActionConfig, submitUnreportedActions } = useUserAction();
  const { fetchTotalPoints } = useUserTotalPoints();
  const { submitUnreportedViewCasts } = useSeenCasts();
  const { loadAllJoinedCommunities, clearJoinedCommunities } =
    useAllJoinedCommunities();
  const { loadWarpcastChannels } = useWarpcastChannels();

  useEffect(() => {
    loadWarpcastChannels();
  }, [loadWarpcastChannels]);

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

  useEffect(() => {
    (async () => {
      if (authenticated) {
        loadAllJoinedCommunities();
      } else {
        clearJoinedCommunities();
      }
    })();
  }, [authenticated, loadAllJoinedCommunities, clearJoinedCommunities]);

  return children;
}
