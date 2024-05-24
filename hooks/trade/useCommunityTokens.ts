import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectCommunityTokens,
} from "~/features/trade/communityTokensSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useCommunityTokens() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectCommunityTokens);

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
