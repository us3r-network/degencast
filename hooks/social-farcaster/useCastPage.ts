import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CastDetailData,
  CastReplayData,
  selectCastPage,
  upsertToCastDetailData,
  setCastReplyData,
  addCastReplyRecordData,
} from "~/features/cast/castPageSlice";
import { useRouter } from "expo-router";

export default function useCastPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { castDetailData, castReplyData, castReplyRecordData } =
    useAppSelector(selectCastPage);

  const setCastDetailCacheData = useCallback(
    (id: string, params: CastDetailData) => {
      dispatch(upsertToCastDetailData({ id, params }));
    },
    [],
  );

  const setCastReplyCacheData = useCallback(
    (id: string, params: CastReplayData) => {
      dispatch(setCastReplyData(params));
    },
    [],
  );

  const navigateToCastReply = useCallback(
    (id: string, params: CastReplayData) => {
      setCastReplyCacheData(id, params);
      router.push(`casts/${id}/reply` as any);
    },
    [router, setCastReplyCacheData],
  );

  const addCastReplyRecordDataToStore = useCallback(
    (id: string, params: CastReplayData) => {
      dispatch(addCastReplyRecordData({ id, params }));
    },
    [dispatch],
  );

  return {
    castDetailData,
    castReplyData,
    castReplyRecordData,
    navigateToCastReply,
    addCastReplyRecordDataToStore,
    setCastDetailCacheData,
  };
}
