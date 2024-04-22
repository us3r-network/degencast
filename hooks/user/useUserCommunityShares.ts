import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectUserCommunityShares,
} from "~/features/user/communitySharesSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserCommunityShares(address: `0x${string}`) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectUserCommunityShares);

  useEffect(() => {
    if (status === AsyncRequestStatus.IDLE) {
      dispatch(fetchItems(address) as unknown as UnknownAction);
    }
  }, [status, dispatch]);

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
  };
}
