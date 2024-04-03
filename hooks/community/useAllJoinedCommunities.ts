import { useCallback } from "react";
import { fetchJoinedCommunities } from "~/services/community/api/community";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectJoinCommunity,
  setJoinedCommunities,
  setJoinedCommunitiesRequestStatus,
} from "~/features/community/joinCommunitySlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import useAuth from "../user/useAuth";

export default function useAllJoinedCommunities() {
  const dispatch = useAppDispatch();
  const { authenticated } = useAuth();
  const { joinedCommunities, joinedCommunitiesRequestStatus } =
    useAppSelector(selectJoinCommunity);

  const loadAllJoinedCommunities = useCallback(async () => {
    if (
      !authenticated ||
      joinedCommunitiesRequestStatus !== AsyncRequestStatus.IDLE
    )
      return;
    try {
      dispatch(setJoinedCommunitiesRequestStatus(AsyncRequestStatus.PENDING));
      const res = await fetchJoinedCommunities({
        pageSize: 1000, // TODO 用的分页列表接口，默认取1000个作为所有列表
        pageNumber: 1,
      });
      const { code, msg, data } = res.data;
      if (code === 0) {
        dispatch(setJoinedCommunities(data));
        dispatch(
          setJoinedCommunitiesRequestStatus(AsyncRequestStatus.FULFILLED),
        );
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      dispatch(setJoinedCommunitiesRequestStatus(AsyncRequestStatus.REJECTED));
    }
  }, [joinedCommunitiesRequestStatus]);

  const clearJoinedCommunities = useCallback(() => {
    dispatch(setJoinedCommunities([]));
    dispatch(setJoinedCommunitiesRequestStatus(AsyncRequestStatus.IDLE));
  }, [dispatch]);

  const joinedCommunitiesPending =
    joinedCommunitiesRequestStatus === AsyncRequestStatus.IDLE;
  return {
    joinedCommunities,
    joinedCommunitiesPending,
    loadAllJoinedCommunities,
    clearJoinedCommunities,
  };
}
