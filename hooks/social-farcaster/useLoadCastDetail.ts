import { useCallback, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { getFarcasterCastInfo } from "~/services/farcaster/api";
import { FarCast } from "~/services/farcaster/types";
import { ApiRespCode } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

export default function useLoadCastDetail() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState<FarCast | null>(null);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const loadCastDetail = useCallback(async (id: string | number) => {
    if (!id) {
      setCast(null);
      return;
    }
    try {
      setLoading(true);
      setCast(null);
      const res = await getFarcasterCastInfo(id as string, {
        withReplies: false,
      });
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        const { farcasterUserData: farcasterUserDataTmp, cast: castTmp } = data;
        const reactions = getReactionsCountAndViewerContexts([castTmp]);
        dispatch(upsertManyToReactions(reactions));

        const userDataObj = userDataObjFromArr(farcasterUserDataTmp);
        setCast(castTmp);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    cast,
    farcasterUserDataObj,
    loadCastDetail,
  };
}
