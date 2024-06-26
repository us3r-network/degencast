import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectUserChannels,
} from "~/features/user/userChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserChannels(fid?: number) {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    next,
    fid: currentFid,
  } = useSelector(selectUserChannels);

  // useEffect(() => {
  //   if (status === AsyncRequestStatus.IDLE && fid) {
  //     dispatch(fetchItems(fid) as unknown as UnknownAction);
  //   }
  // }, [status, dispatch, fid]);

  useEffect(() => {
    loadMore();
  }, [fid]);

  const loadMore = () => {
    if (status === AsyncRequestStatus.PENDING && fid === currentFid) return;
    if (fid) dispatch(fetchItems(fid) as unknown as UnknownAction);
  };

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
    hasNext: !!next.cursor,
    loadMore,
  };
}
