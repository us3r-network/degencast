import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CastDetailData,
  selectCastPage,
  setCastDetailData,
  updateCastDetailData,
} from "~/features/cast/castPageSlice";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { getCastDetails } from "~/services/farcaster/api";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";

export default function useCastDetails() {
  const dispatch = useAppDispatch();
  const { castDetailData } = useAppSelector(selectCastPage);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const loading = status === AsyncRequestStatus.PENDING;

  const setCastDetailCacheData = useCallback((data: CastDetailData) => {
    dispatch(updateCastDetailData(data));
  }, []);

  const loadCastDetail = useCallback(async (castHash: string) => {
    if (!castHash) return;
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const resp = await getCastDetails(castHash);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;

      dispatch(updateCastDetailData({ ...data }));
      setStatus(AsyncRequestStatus.FULFILLED);

      const reactions = getReactionsCountAndViewerContexts([data.cast]);
      dispatch(upsertManyToReactions(reactions));
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    }
  }, []);

  return {
    loading,
    castDetailData,
    setCastDetailCacheData,
    loadCastDetail,
  };
}
