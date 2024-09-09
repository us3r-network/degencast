import { useCallback, useEffect } from "react";
import {
  fetchItems,
  groupDataDefault,
  selectCommunityDetailCasts,
} from "~/features/community/communityDetailCastsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCommunityCasts(channelId: string) {
  const dispatch = useAppDispatch();
  const groupData = useAppSelector(selectCommunityDetailCasts);
  const {
    items: casts,
    pageInfo,
    status,
    errorMsg,
  } = groupData[channelId] || groupDataDefault;
  const loading = status === AsyncRequestStatus.PENDING;

  const loadCasts = useCallback(async () => {
    if (loading) return;
    dispatch(fetchItems({ channelId }));
  }, [channelId, loading]);

  useEffect(() => {
    if (
      !channelId ||
      casts.length > 0 ||
      [AsyncRequestStatus.FULFILLED, AsyncRequestStatus.REJECTED].includes(
        status,
      )
    ) {
      return;
    }
    loadCasts();
  }, [casts, status, channelId]);

  return {
    loading,
    casts,
    pageInfo,
    errorMsg,
    loadCasts,
  };
}
