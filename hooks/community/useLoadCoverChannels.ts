import { useCallback } from "react";
import {
  fetchItems,
  selectCoverChannels,
} from "~/features/community/coverChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCoverChannels() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectCoverChannels);
  const { items: coverChannels, pageInfo, status, errorMsg } = data;
  const loading = status === AsyncRequestStatus.PENDING;
  const rejected = status === AsyncRequestStatus.REJECTED;

  const loadCoverChannels = useCallback(async () => {
    if (loading) return;
    dispatch(fetchItems());
  }, [loading]);

  return {
    loading,
    rejected,
    coverChannels,
    pageInfo,
    errorMsg,
    loadCoverChannels,
  };
}
