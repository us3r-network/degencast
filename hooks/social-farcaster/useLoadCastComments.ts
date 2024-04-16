import { useCallback, useState } from "react";
import { getFarcasterCastInfo } from "~/services/farcaster/api";
import { FarCast } from "~/services/farcaster/types";
import { ApiRespCode } from "~/services/shared/types";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

export default function useLoadCastComments() {
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const [comments, setComments] =
    useState<{ data: FarCast; platform: "farcaster" }[]>();
  const loadCastComments = useCallback(async (id: string | number) => {
    if (!id) {
      setComments([]);
      return;
    }
    try {
      setLoading(true);
      setComments([]);
      const res = await getFarcasterCastInfo(id as string, {});
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        const {
          farcasterUserData: farcasterUserDataTmp,
          comments: commentsTmp,
        } = data;

        const userDataObj = userDataObjFromArr(farcasterUserDataTmp);
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
    comments,
    farcasterUserDataObj,
    loadCastComments,
  };
}
