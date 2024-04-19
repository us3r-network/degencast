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
import useFarcasterWrite from "../social-farcaster/useFarcasterWrite";

export default function useJoinCommunityAction(communityInfo: CommunityInfo) {
  const communityId = communityInfo?.id;
  const dispatch = useAppDispatch();
  const { login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { prepareWrite: farcasterPrepareWrite } = useFarcasterWrite();
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
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
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
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(removeOneFromJoinActionPendingIds(communityId));
    }
  }, [dispatch, isPending, communityId, authenticated, login]);

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
