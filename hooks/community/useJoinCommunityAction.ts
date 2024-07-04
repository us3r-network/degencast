import { useCallback, useMemo } from "react";
import {
  fetchCommunity,
  fetchJoiningChannel,
  fetchUnjoiningChannel,
} from "~/services/community/api/community";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  addOneToJoinActionPendingIds,
  addOneToJoinedCommunities,
  removeOneFromJoinActionPendingIds,
  removeOneFromJoinedCommunitiesByChannelId,
  selectJoinCommunity,
} from "~/features/community/joinCommunitySlice";
import { ApiRespCode } from "~/services/shared/types";
import useAuth from "../user/useAuth";
import useFarcasterAccount from "../social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "../social-farcaster/useFarcasterSigner";
import Toast from "react-native-toast-message";

export default function useJoinCommunityAction(
  channelId: string,
  opts?: { showToast?: boolean },
) {
  const { showToast } = opts || {};
  const dispatch = useAppDispatch();
  const { login, ready, authenticated } = useAuth();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { joinActionPendingIds, joinedCommunities, joinedCommunitiesPending } =
    useAppSelector(selectJoinCommunity);

  const joined = useMemo(
    () =>
      !!channelId &&
      joinedCommunities.some((item) => item?.channelId === channelId),
    [joinedCommunities, channelId],
  );
  const isPending = useMemo(
    () => !!channelId && joinActionPendingIds.includes(channelId),
    [joinActionPendingIds, channelId],
  );
  const isDisabled = useMemo(
    () => !channelId || isPending || joinedCommunitiesPending,
    [channelId, isPending, joinedCommunitiesPending],
  );

  const joiningAction = useCallback(async () => {
    if (!channelId) return;
    if (!authenticated) {
      login();
      return;
    }
    if (!currFid || !hasSigner) {
      requestSigner();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(channelId));
      // const response = await fetchJoiningCommunity(channelId);
      const response = await fetchJoiningChannel(channelId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        const communityRes = await fetchCommunity(channelId);
        const { data, code } = communityRes.data;
        if (code === ApiRespCode.SUCCESS) {
          dispatch(addOneToJoinedCommunities(data));
        }
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
      dispatch(removeOneFromJoinActionPendingIds(channelId));
    }
  }, [
    dispatch,
    channelId,
    isPending,
    authenticated,
    login,
    currFid,
    hasSigner,
    showToast,
  ]);

  const unjoiningAction = useCallback(async () => {
    if (!channelId) return;
    if (!authenticated) {
      login();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(channelId));
      // const response = await fetchUnjoiningCommunity(channelId);
      const response = await fetchUnjoiningChannel(channelId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(removeOneFromJoinedCommunitiesByChannelId(channelId));
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
      dispatch(removeOneFromJoinActionPendingIds(channelId));
    }
  }, [dispatch, isPending, channelId, authenticated, login, showToast]);

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
