import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectCommunityRank,
} from "~/features/trade/communityRankSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useCommunityRank() {
  const dispatch = useDispatch();
  const { items, status, error, nextPageNumber } =
    useSelector(selectCommunityRank);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchItems() as unknown as UnknownAction);
    }
  }, [status, dispatch]);

  return {
    items,
    nextPageNumber,
    loading: status === AsyncRequestStatus.PENDING,
    loadMore: fetchItems,
    error,
  };
}
