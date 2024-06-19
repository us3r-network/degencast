import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DEFAULT_ORDER_PARAMS,
  fetchItems,
  selectCommunityRank,
} from "~/features/rank/communityRankSlice";
import { CommunityRankOrderBy } from "~/services/community/types/rank";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useCommunityRank() {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    nextPageNumber,
    order: currentOrder,
    orderBy: currentOrderBy,
  } = useSelector(selectCommunityRank);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchItems(DEFAULT_ORDER_PARAMS) as unknown as UnknownAction);
    }
  }, []);

  const load = ({
    order,
    orderBy,
  }: {
    order: "ASC" | "DESC";
    orderBy: CommunityRankOrderBy;
  }) => {
    if (
      currentOrder === order &&
      currentOrderBy === orderBy &&
      status === AsyncRequestStatus.PENDING
    )
      return;
    dispatch(
      fetchItems({
        order,
        orderBy,
      }) as unknown as UnknownAction,
    );
  };

  return {
    items,
    hasMore: nextPageNumber > 0,
    loading: status === AsyncRequestStatus.PENDING,
    load,
    error,
  };
}
