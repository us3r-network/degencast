import { UnknownAction } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, selectUserCasts } from "~/features/user/userCastsSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserCasts(fid?: number, viewer_fid?: number) {
  const dispatch = useDispatch();
  const { items, status, error, next } = useSelector(selectUserCasts);

  useEffect(() => {
    loadMore();
  }, [fid, viewer_fid]);

  const loadMore = () => {
    if (status !== AsyncRequestStatus.PENDING && fid) {
      dispatch(fetchItems({ fid, viewer_fid }) as unknown as UnknownAction);
    }
  };

  return {
    items,
    loading: status === AsyncRequestStatus.PENDING,
    error,
    hasNext: !!next.cursor,
    loadMore,
  };
}
