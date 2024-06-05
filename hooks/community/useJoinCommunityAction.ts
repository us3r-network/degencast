import { useCallback, useMemo } from "react";
import {
  fetchJoiningCommunity,
  fetchUnjoiningCommunity,
} from "~/services/community/api/community";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
// import useLogin from '../shared/useLogin';
import {
  addOneToJoinActionPendingIds,
  addOneToJoinedCommunities,
  removeOneFromJoinActionPendingIds,
  removeOneFromJoinedCommunities,
  selectJoinCommunity,
} from "~/features/community/joinCommunitySlice";
import { ApiRespCode } from "~/services/shared/types";
import { CommunityInfo } from "~/services/community/types/community";
import useAuth from "../user/useAuth";
import { usePrivy } from "@privy-io/react-auth";
import useFarcasterAccount from "../social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "../social-farcaster/useFarcasterSigner";
import Toast from "react-native-toast-message";

export default function useJoinCommunityAction(
  communityInfo: CommunityInfo,
  opts?: { showToast?: boolean },
) {
  const { showToast } = opts || {};
  const communityId = communityInfo?.id;
  const dispatch = useAppDispatch();
  const { login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { prepareWrite: farcasterPrepareWrite } = useFarcasterSigner();
  const { authenticated } = useAuth();
  const { joinActionPendingIds, joinedCommunities, joinedCommunitiesPending } =
    useAppSelector(selectJoinCommunity);

  const joined = useMemo(
    () => joinedCommunities.some((item) => item.id === communityId),
    [joinedCommunities, communityId],
  );
  const isPending = useMemo(
    () => joinActionPendingIds.includes(communityId),
    [joinActionPendingIds, communityId],
  );
  const isDisabled = useMemo(
    () => !communityId || isPending || joinedCommunitiesPending,
    [communityId, isPending, joinedCommunitiesPending],
  );

  const joiningAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid) {
      farcasterPrepareWrite();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(communityId));
      const response = await fetchJoiningCommunity(communityId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(addOneToJoinedCommunities(communityInfo));
        // if (showToast) {
        //   Toast.show({
        //     type: "success",
        //     text1: "Joined",
        //   });
        // }
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      if (showToast) {
        Toast.show({
          type: "error",
          text1: "Failed to join",
        });
      }
    } finally {
      dispatch(removeOneFromJoinActionPendingIds(communityId));
    }
  }, [
    dispatch,
    communityId,
    communityInfo,
    isPending,
    authenticated,
    login,
    currFid,
    farcasterPrepareWrite,
    showToast,
  ]);

  const unjoiningAction = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(communityId));
      const response = await fetchUnjoiningCommunity(communityId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(removeOneFromJoinedCommunities(communityId));
        // if (showToast) {
        //   Toast.show({
        //     type: "success",
        //     text1: "Unjoined",
        //   });
        // }
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      if (showToast) {
        Toast.show({
          type: "error",
          text1: "Failed to unjoin",
        });
      }
    } finally {
      dispatch(removeOneFromJoinActionPendingIds(communityId));
    }
  }, [dispatch, isPending, communityId, authenticated, login, showToast]);

  const joinChangeAction = useCallback(() => {
    if (joined) {
      unjoiningAction();
    } else {
      joiningAction();
    }
  }, [joined, unjoiningAction, joiningAction]);

  return {
    joined,
    isPending,
    isDisabled,
    joiningAction,
    unjoiningAction,
    joinChangeAction,
  };
}
