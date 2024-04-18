import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CastDetailData,
  selectCastPage,
  upsertToCastDetailData,
} from "~/features/cast/castPageSlice";
import { useRouter } from "expo-router";

export default function useCastPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { castDetailData } = useAppSelector(selectCastPage);

  const navigateToCastDetail = useCallback(
    (id: string, params: CastDetailData) => {
      dispatch(upsertToCastDetailData({ id, params }));
      router.push(`casts/${id}` as any);
    },
    [router],
  );
  const getCastDetailData = useCallback(
    (id: string) => {
      return castDetailData[id];
    },
    [castDetailData],
  );
  return {
    getCastDetailData,
    navigateToCastDetail,
  };
}
