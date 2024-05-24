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

  const navigateToCastDetail = useCallback(
    (id: string, params: CastDetailData) => {
      dispatch(upsertToCastDetailData({ id, params }));
      router.push(`casts/${id}` as any);
    },
    [router],
  );

  const navigateToCastReply = useCallback(
    (id: string, params: CastReplayData) => {
      dispatch(setCastReplyData(params));
      router.push(`casts/${id}/reply` as any);
    },
    [router],
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
    navigateToCastDetail,
    addCastReplyRecordDataToStore,
  };
}
