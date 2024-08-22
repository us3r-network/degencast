import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, selectUserCasts } from "~/features/user/userCastsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserCasts(fid?: number, viewer_fid?: number) {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    next,
    fid: currentFid,
  } = useSelector(selectUserCasts);

  useEffect(() => {
    if (items?.length === 0 || fid !== currentFid) loadItems();
  }, [fid, viewer_fid]);

  const loadItems = () => {
    if (status !== AsyncRequestStatus.PENDING && fid) {
      dispatch(fetchItems({ fid, viewer_fid }) as unknown as UnknownAction);
    }
  };

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
    hasNext: !!next.cursor,
    loadItems,
  };
}
