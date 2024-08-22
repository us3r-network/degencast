import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DEFAULT_ORDER_PARAMS,
  fetchItems,
  selectCuratorRank,
} from "~/features/rank/curatorRankSlice";
import { RankOrderBy } from "~/services/rank/types";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useCuratorRank(channel?: string) {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    nextPageNumber,
    order: currentOrder,
    orderBy: currentOrderBy,
  } = useSelector(selectCuratorRank);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(
        fetchItems({
          orderParam: DEFAULT_ORDER_PARAMS,
          channel,
        }) as unknown as UnknownAction,
      );
    }
  }, []);

  const load = ({
    order,
    orderBy,
  }: {
    order: "ASC" | "DESC";
    orderBy: RankOrderBy;
  } = DEFAULT_ORDER_PARAMS) => {
    if (
      currentOrder === order &&
      currentOrderBy === orderBy &&
      status === AsyncRequestStatus.PENDING
    )
      return;
    dispatch(
      fetchItems({
        orderParam: { order, orderBy },
        channel,
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
