import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectUserCommunityTokens,
} from "~/features/user/communityTokensSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserCommunityTokens(address: `0x${string}`) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectUserCommunityTokens);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchItems(address) as unknown as UnknownAction);
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status !== AsyncRequestStatus.PENDING) {
      dispatch(fetchItems(address) as unknown as UnknownAction);
    }
  }, [address]);

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
  };
}
