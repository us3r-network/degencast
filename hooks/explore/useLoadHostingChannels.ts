import { useEffect, useState } from "react";
import {
  fetchItems,
  selectExploreHostingChannels,
} from "~/features/community/exploreHostingChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
// import useSwipeChannelsActions from "./useSwipeChannelsActions";

const LOAD_MORE_CRITICAL_NUM = 5;
export default function useLoadHostingChannels(opts: {
  swipeDataRefValue?: any;
  onViewActionSubmited?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { items, pageInfo, status, errorMsg } = useAppSelector(
    selectExploreHostingChannels,
  );
  const loading = status === AsyncRequestStatus.PENDING;

  const itemsLen = items.length;

  const loadHostingChannels = () => {
    dispatch(fetchItems());
  };
  useEffect(() => {
    if (loading) return;
    const remainingLen = itemsLen - (currentIndex + 1);
    if (remainingLen < LOAD_MORE_CRITICAL_NUM) {
      loadHostingChannels();
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
