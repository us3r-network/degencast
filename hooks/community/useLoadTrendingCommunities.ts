import { useCallback } from "react";
import {
  fetchItems,
  selectCommunityTrending,
} from "~/features/community/communityTrendingSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadTrendingCommunities() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectCommunityTrending);
  const { items: trendingCommunities, pageInfo, status, errorMsg } = data;
  const loading = status === AsyncRequestStatus.PENDING;

  const loadTrendingCommunities = useCallback(async () => {
    if (loading) return;
    dispatch(fetchItems());
  }, [loading]);

  return {
    loading,
    trendingCommunities,
    pageInfo,
    errorMsg,
    loadTrendingCommunities,
  };
}
