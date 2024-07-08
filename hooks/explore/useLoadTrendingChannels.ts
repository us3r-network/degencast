import { useEffect, useState } from "react";
import {
  fetchItems,
  selectExploreTrendingChannels,
} from "~/features/community/exploreTrendingChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import useSwipeChannelsActions from "./useSwipeChannelsActions";

const LOAD_MORE_CRITICAL_NUM = 5;
export default function useLoadTrendingChannels(opts: {
  swipeDataRefValue?: any;
  onViewActionSubmited?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { items, pageInfo, status, errorMsg } = useAppSelector(
    selectExploreTrendingChannels,
  );
  const loading = status === AsyncRequestStatus.PENDING;

  const itemsLen = items.length;

  const loadTrendingChannels = () => {
    dispatch(fetchItems());
  };
  useEffect(() => {
    if (loading) return;
    const remainingLen = itemsLen - (currentIndex + 1);
    if (remainingLen < LOAD_MORE_CRITICAL_NUM) {
      loadTrendingChannels();
    }
  }, [currentIndex, itemsLen, loading]);

  useSwipeChannelsActions({
    channels: items,
    currentIndex: currentIndex,
    swipeDataRefValue: opts.swipeDataRefValue,
    onViewActionSubmited: opts.onViewActionSubmited,
  });

  return {
    loading,
    items,
    pageInfo,
    errorMsg,
    currentIndex,
    setCurrentIndex,
  };
}
