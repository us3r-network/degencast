import { useCallback, useState } from "react";
import {
  fetchStatistics,
  groupDataDefault,
  selectCommunityShareStatistics,
} from "~/features/community/communityShareStatisticsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCommunityShareStatistics(channelId: string) {
  const dispatch = useAppDispatch();
  const groupData = useAppSelector(selectCommunityShareStatistics);
  const {
    statistics: shareStatistics,
    status,
    errorMsg,
  } = groupData[channelId] || groupDataDefault;
  const loading = status === AsyncRequestStatus.PENDING;
  const idle = status === AsyncRequestStatus.IDLE;

  const loadShareStatistics = useCallback(async () => {
    if (loading) return;
    dispatch(fetchStatistics({ channelId }));
  }, [channelId, loading]);

  return {
    loading,
    idle,
    shareStatistics,
    errorMsg,
    loadShareStatistics,
  };
}
