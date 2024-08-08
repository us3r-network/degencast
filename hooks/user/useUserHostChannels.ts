import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserHostChannels,
  getHostChannels,
} from "~/features/user/userHostChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserHostChannels(fid?: number) {
  const dispatch = useDispatch();
  const { channels, status, error, done } = useSelector(selectUserHostChannels);

  // useEffect(() => {
  //   if (status !== AsyncRequestStatus.IDLE && fid) {
  //     dispatch(getHostChannels(fid) as unknown as UnknownAction);
  //   }
  // }, [status, dispatch, fid]);

  const loadUserHostChannels = (fid: number) => {
    if (status !== AsyncRequestStatus.IDLE && fid) {
      dispatch(getHostChannels(fid) as unknown as UnknownAction);
    }
  };

  return {
    channels,
    loading: status === AsyncRequestStatus.PENDING,
    error,
    done,
    loadUserHostChannels,
  };
}
