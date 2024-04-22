import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectCommunityShares,
} from "~/features/trade/communitySharesSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useCommunityShares() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectCommunityShares);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchItems() as unknown as UnknownAction);
    }
  }, [status, dispatch]);

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
  };
}
