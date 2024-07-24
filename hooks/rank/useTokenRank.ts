import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DEFAULT_ORDER_PARAMS,
  fetchItems,
  selectTokenRank,
} from "~/features/rank/tokenRankSlice";
import { RankOrderBy } from "~/services/rank/types";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useTokenRank() {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    nextPageNumber,
    order: currentOrder,
    orderBy: currentOrderBy,
  } = useSelector(selectTokenRank);

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
    orderBy: RankOrderBy;
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
