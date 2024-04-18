import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CastDetailData,
  selectCastPage,
  upsertToCastDetailData,
} from "~/features/cast/castPageSlice";
import { useNavigation, useRouter } from "expo-router";

export default function useCastPageRoute() {
  // const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { castDetailData } = useAppSelector(selectCastPage);

  const navigateToCastDetail = useCallback(
    (id: string, params: CastDetailData) => {
      dispatch(upsertToCastDetailData({ id, params }));
      router.push(`casts/${id}` as any);
      // navigation.navigate(
      //   ...(["casts", { screen: "[id]", params: { id } }] as never),
      // );
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
