import { useCallback } from "react";
import { fetchWarpcastChannels } from "~/services/community/api/community";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

import {
  selectWarpcastChannels,
  setWarpcastChannelsRequestStatus,
  setWarpcastChannels,
} from "~/features/community/warpcastChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useAllJoinedCommunities() {
  const dispatch = useAppDispatch();
  const { warpcastChannels, warpcastChannelsRequestStatus } = useAppSelector(
    selectWarpcastChannels,
  );

  const loadWarpcastChannels = useCallback(async () => {
    if (warpcastChannelsRequestStatus !== AsyncRequestStatus.IDLE) return;
    try {
      dispatch(setWarpcastChannelsRequestStatus(AsyncRequestStatus.PENDING));
      const res = await fetchWarpcastChannels();
      const { code, msg, data } = res.data;
      if (code === 0) {
        dispatch(setWarpcastChannels(data));
        dispatch(
          setWarpcastChannelsRequestStatus(AsyncRequestStatus.FULFILLED),
        );
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      dispatch(setWarpcastChannelsRequestStatus(AsyncRequestStatus.REJECTED));
    }
  }, []);

  const warpcastChannelsPending =
    warpcastChannelsRequestStatus === AsyncRequestStatus.IDLE;

  return {
    warpcastChannels,
    warpcastChannelsPending,
    loadWarpcastChannels,
  };
}
