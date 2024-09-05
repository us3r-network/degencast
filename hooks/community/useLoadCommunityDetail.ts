import { useCallback, useState } from "react";
import {
  addCommunityDetailPendingId,
  removeCommunityDetailPendingId,
  selectCommunityDetail,
  upsertCommunityDetailData,
} from "~/features/community/communityDetailSlice";
import { fetchCommunity } from "~/services/community/api/community";
import { ApiRespCode } from "~/services/shared/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadCommunityDetail(id: string) {
  const dispatch = useAppDispatch();
  const { basicData, detailData, detailPendingIds } = useAppSelector(
    selectCommunityDetail,
  );

  const communityDetail = detailData[id];
  const communityBasic = basicData[id];
  const loading = detailPendingIds.includes(id);
  const [rejected, setRejected] = useState(false);

  const loadCommunityDetail = useCallback(async () => {
    if (!id || loading) {
      return;
    }
    try {
      dispatch(addCommunityDetailPendingId(id));
      const res = await fetchCommunity(id);
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(
          upsertCommunityDetailData({
            id,
            data: {
              ...data,
              tokens: data?.tokens?.filter((item) => !!item) || [],
            },
          }),
        );
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      setRejected(true);
    } finally {
      dispatch(removeCommunityDetailPendingId(id));
    }
  }, [id, loading]);

  return {
    loading,
    rejected,
    communityDetail,
    communityBasic,
    loadCommunityDetail,
  };
}
