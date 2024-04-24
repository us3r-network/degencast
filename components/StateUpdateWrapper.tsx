import { PropsWithChildren, useEffect, useRef } from "react";
import useUserAction from "~/hooks/user/useUserAction";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import useSeenCasts from "~/hooks/user/useSeenCasts";
import useAuth from "~/hooks/user/useAuth";
import useAllJoinedCommunities from "~/hooks/community/useAllJoinedCommunities";
import useWarpcastChannels from "~/hooks/community/useWarpcastChannels";
import useUserInviteCode from "~/hooks/user/useUserInviteCode";
import { UserActionName } from "~/services/user/types";

export default function StateUpdateWrapper({ children }: PropsWithChildren) {
  const { authenticated, justRegistered } = useAuth();

  // user action
  const { fetchUserActionConfig, submitUnreportedActions, submitUserAction } =
    useUserAction();
  const { fetchTotalPoints } = useUserTotalPoints();
  const { submitUnreportedViewCasts } = useSeenCasts();
  const { loadAllJoinedCommunities, clearJoinedCommunities } =
    useAllJoinedCommunities();
  const { loadWarpcastChannels } = useWarpcastChannels();
  const {
    checkInviteLinkParams,
    usedOtherInviteFid,
    clearUsedOtherInviteData,
  } = useUserInviteCode();

  // Check if the routing link has an invitation code
  useEffect(() => {
    checkInviteLinkParams();
  }, [checkInviteLinkParams]);

  // If you have just registered and used someone else’s invitation code, submit the invitation behavior
  const submitInviteActionPending = useRef(false);
  useEffect(() => {
    (async () => {
      if (submitInviteActionPending.current) return;
      if (justRegistered && usedOtherInviteFid) {
        try {
          submitInviteActionPending.current = true;
          await submitUserAction({
            action: UserActionName.Invite,
            data: {
              inviteFid: usedOtherInviteFid,
            },
          });
          clearUsedOtherInviteData();
        } catch (error) {
        } finally {
          submitInviteActionPending.current = false;
        }
      }
    })();
  }, [
    justRegistered,
    usedOtherInviteFid,
    clearUsedOtherInviteData,
    submitUserAction,
  ]);

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
