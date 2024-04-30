import { useCallback, useRef, useState } from "react";
import {
  addManyItems,
  selectCommunityDetailTipsRank,
  setLoading,
  setPageInfo,
} from "~/features/community/communityDetailTipsRankSlice";
import { fetchCommunityTipsRank } from "~/services/community/api/tips";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

const PAGE_SIZE = 20;
const groupDataDefault = {
  items: [],
  pageInfo: {
    hasNextPage: true,
    nextPageNumber: 1,
  },
  loading: false,
};
export default function useLoadCommunityTipsRank(channelId: string) {
  const dispatch = useAppDispatch();
  const { groupData } = useAppSelector(selectCommunityDetailTipsRank);
  const {
    items: tipsRank,
    pageInfo,
    loading,
  } = groupData[channelId] || groupDataDefault;

  const loadTipsRank = useCallback(async () => {
    const { hasNextPage, nextPageNumber } = pageInfo;
    if (!channelId || loading || hasNextPage === false) {
      return;
    }
    dispatch(setLoading({ channelId, loading: true }));
    try {
      const resp = await fetchCommunityTipsRank({
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        channelId,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      dispatch(addManyItems({ channelId, items: data }));

      const hasNextPage = data?.length >= PAGE_SIZE;
      dispatch(
        setPageInfo({
          channelId,
          pageInfo: {
            hasNextPage,
            nextPageNumber: nextPageNumber + 1,
          },
        }),
      );
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading({ channelId, loading: false }));
    }
  }, [channelId, loading, pageInfo]);

  return {
    loading,
    tipsRank,
    pageInfo,
    loadTipsRank,
  };
}
