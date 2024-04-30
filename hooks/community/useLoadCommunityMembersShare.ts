import { useCallback } from "react";
import {
  fetchItems,
  groupDataDefault,
  selectCommunityDetailShares,
} from "~/features/community/communityDetailSharesSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCommunityMembersShare(channelId: string) {
  const dispatch = useAppDispatch();
  const groupData = useAppSelector(selectCommunityDetailShares);
  const {
    items: membersShare,
    pageInfo,
    status,
    errorMsg,
  } = groupData[channelId] || groupDataDefault;
  const loading = status === AsyncRequestStatus.PENDING;

  const loadMembersShare = useCallback(async () => {
    if (loading) return;
    dispatch(fetchItems({ channelId }));
  }, [channelId, loading]);

  return {
    loading,
    membersShare,
    pageInfo,
    errorMsg,
    loadMembersShare,
  };
}
