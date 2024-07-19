import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItems,
  selectUserChannels,
  UserChannelsType,
} from "~/features/user/userChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserChannels( fid: number | undefined, type: UserChannelsType) {
  const dispatch = useDispatch();
  const {
    channels,
    status,
    error,
    fid: currentFid,
  } = useSelector(selectUserChannels);

  // useEffect(() => {
  //   if (status === AsyncRequestStatus.IDLE && fid) {
  //     dispatch(fetchItems(fid) as unknown as UnknownAction);
  //   }
  // }, [status, dispatch, fid]);

  useEffect(() => {
    loadMore();
  }, [fid, type]);

  const loadMore = () => {
    if (status === AsyncRequestStatus.PENDING && fid === currentFid) return;
    if (fid && type)
      dispatch(fetchItems({ fid, type }) as unknown as UnknownAction);
  };

  return {
    items: channels.get(type)?.items || [],
    loading: status === AsyncRequestStatus.PENDING,
    error,
    hasNext: !!channels.get(type)?.next.cursor,
    loadMore,
  };
}
