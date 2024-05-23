import { PropsWithChildren, useEffect } from "react";
import useUserAction from "~/hooks/user/useUserAction";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import useSeenCasts from "~/hooks/user/useSeenCasts";
import useAuth from "~/hooks/user/useAuth";
import useAllJoinedCommunities from "~/hooks/community/useAllJoinedCommunities";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";
import useUserInviteCode from "~/hooks/user/useUserInviteCode";
import useCastCollection from "~/hooks/social-farcaster/cast-nft/useCastCollection";

export default function StateUpdateWrapper({ children }: PropsWithChildren) {
  const { authenticated, checkDegencastLogin } = useAuth();

  const { fetchUserActionConfig, submitUnreportedActions } = useUserAction();
  const { fetchTotalPoints } = useUserTotalPoints();
  const { submitUnreportedViewCasts } = useSeenCasts();
  const { loadAllJoinedCommunities, clearJoinedCommunities } =
    useAllJoinedCommunities();
  const { loadWarpcastChannels } = useWarpcastChannels();
  const { checkInviteLinkParams, clearUsedInviterData } = useUserInviteCode();
  const { fetchCastCollections } = useCastCollection();

  useEffect(() => {
    checkDegencastLogin();
  }, [checkDegencastLogin]);

  useEffect(() => {
    checkInviteLinkParams();
  }, [checkInviteLinkParams]);

  useEffect(() => {
    if (authenticated) {
      clearUsedInviterData();
    }
  }, [authenticated, clearUsedInviterData]);

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

  useEffect(() => {
    fetchCastCollections();
  }, [fetchCastCollections]);

  return children;
}
