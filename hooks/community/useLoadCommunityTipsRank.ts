import { useCallback } from "react";
import {
  fetchItems,
  groupDataDefault,
  selectCommunityDetailTipsRank,
} from "~/features/community/communityDetailTipsRankSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCommunityTipsRank(channelId: string) {
  const dispatch = useAppDispatch();
  const groupData = useAppSelector(selectCommunityDetailTipsRank);
  const {
    items: tipsRank,
    pageInfo,
    status,
    errorMsg,
  } = groupData[channelId] || groupDataDefault;
  const loading = status === AsyncRequestStatus.PENDING;

  const loadTipsRank = useCallback(async () => {
    if (
      [AsyncRequestStatus.PENDING, AsyncRequestStatus.REJECTED].includes(status)
    )
      return;
    dispatch(fetchItems({ channelId }));
  }, [channelId, status]);

  return {
    loading,
    tipsRank,
    pageInfo,
    errorMsg,
    loadTipsRank,
  };
}
