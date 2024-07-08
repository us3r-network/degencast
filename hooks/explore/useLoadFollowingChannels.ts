import { useEffect, useState } from "react";
import {
  fetchItems,
  selectExploreFollowingChannels,
} from "~/features/community/exploreFollowingChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
// import useSwipeChannelsActions from "./useSwipeChannelsActions";

const LOAD_MORE_CRITICAL_NUM = 5;
export default function useLoadFollowingChannels(opts: {
  swipeDataRefValue?: any;
  onViewActionSubmited?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { items, pageInfo, status, errorMsg } = useAppSelector(
    selectExploreFollowingChannels,
  );
  const loading = status === AsyncRequestStatus.PENDING;

  const itemsLen = items.length;

  const loadFollowingChannels = () => {
    dispatch(fetchItems());
  };
  useEffect(() => {
    if (loading) return;
    const remainingLen = itemsLen - (currentIndex + 1);
    if (remainingLen < LOAD_MORE_CRITICAL_NUM) {
      loadFollowingChannels();
    }
  }, [currentIndex, itemsLen, loading]);

  // useSwipeChannelsActions({
  //   channels: items,
  //   currentIndex: currentIndex,
  //   swipeDataRefValue: opts.swipeDataRefValue,
  //   onViewActionSubmited: opts.onViewActionSubmited,
  // });

  return {
    loading,
    items,
    pageInfo,
    errorMsg,
    currentIndex,
    setCurrentIndex,
  };
}
