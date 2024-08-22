import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CastReplayData,
  selectCastPage,
  setCastReplyData,
  addCastReplyRecordData,
} from "~/features/cast/castPageSlice";
import { useRouter } from "expo-router";

export default function useCastReply() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { castReplyData, castReplyRecordData } = useAppSelector(selectCastPage);

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
    castReplyData,
    castReplyRecordData,
    navigateToCastReply,
    addCastReplyRecordDataToStore,
  };
}
