import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectUserCommunityNFTs,
} from "~/features/user/communityNFTsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserCommunityTokens(address?: `0x${string}`) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectUserCommunityNFTs);

  // useEffect(() => {
  //   if (status === AsyncRequestStatus.IDLE && address) {
  //     dispatch(fetchItems(address) as unknown as UnknownAction);
  //   }
  // }, [status, dispatch]);

  useEffect(() => {
    if (status !== AsyncRequestStatus.PENDING && address) {
      dispatch(fetchItems(address) as unknown as UnknownAction);
    }
  }, [address]);

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
  };
}
