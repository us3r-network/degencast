import { useEffect, useState } from "react";
import {
  fetchItems,
  selectExploreTrendingChannels,
} from "~/features/community/exploreTrendingChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import useSwipeCastsActions from "./useSwipeCastsActions";

const LOAD_MORE_CRITICAL_NUM = 5;
export default function useLoadTrendingChannels(opts: {
  swipeDataRefValue?: any;
  onViewCastActionSubmited?: () => void;
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

  // useSwipeCastsActions({
  //   casts: items.map((channel) => channel.cast),
  //   currentCastIndex: currentIndex,
  //   swipeDataRefValue: opts.swipeDataRefValue,
  //   onViewCastActionSubmited: opts.onViewCastActionSubmited,
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
