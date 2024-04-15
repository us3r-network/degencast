import { useCallback, useState } from "react";
import { getFarcasterCastInfo } from "~/services/farcaster/api";
import { FarCast } from "~/services/farcaster/types";
import { ApiRespCode } from "~/services/shared/types";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

export default function useLoadCastDetail() {
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState<FarCast | null>(null);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const [comments, setComments] =
    useState<{ data: FarCast; platform: "farcaster" }[]>();
  const loadCastDetail = useCallback(async (id: string | number) => {
    if (!id) {
      setCast(null);
      return;
    }
    try {
      setLoading(true);
      setCast(null);
      const res = await getFarcasterCastInfo(id as string, {});
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        const {
          farcasterUserData: farcasterUserDataTmp,
          cast: castTmp,
          comments: commentsTmp,
        } = data;

        const userDataObj = userDataObjFromArr(farcasterUserDataTmp);
        setCast(castTmp);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        setComments(commentsTmp);
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
    comments,
    farcasterUserDataObj,
    loadCastDetail,
  };
}
