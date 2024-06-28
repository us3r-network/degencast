import { useEffect, useState } from "react";
import {
  fetchItems,
  selectExploreFollowingChannels,
} from "~/features/community/exploreFollowingChannelsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import useSwipeCastsActions from "./useSwipeCastsActions";

const LOAD_MORE_CRITICAL_NUM = 5;
export default function useLoadFollowingChannels(opts: {
  swipeDataRefValue?: any;
  onViewCastActionSubmited?: () => void;
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
