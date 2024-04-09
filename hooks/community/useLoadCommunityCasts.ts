import { useRef, useState } from "react";
import {
  TrendingCastData,
  getFarcasterTrendingWithChannelId,
} from "~/services/farcaster/api";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

const PAGE_SIZE = 30;

export default function useLoadCommunityCasts() {
  const [casts, setCasts] = useState<Array<TrendingCastData>>([]);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const shannelIdRef = useRef("");
  const pageInfoRef = useRef({
    hasNextPage: true,
    endIndex: 0,
  });

  const loadCasts = async (channelId: string) => {
    if (channelId !== shannelIdRef.current) {
      shannelIdRef.current = channelId;
      setCasts([]);
      setFarcasterUserDataObj({});
      pageInfoRef.current = {
        hasNextPage: true,
        endIndex: 0,
      };
    }
    const { hasNextPage, endIndex } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterTrendingWithChannelId({
        start: endIndex === 0 ? 0 : endIndex + 1,
        end: endIndex === 0 ? PAGE_SIZE - 1 : endIndex + PAGE_SIZE,
        channelId,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo } = data;

      setCasts((pre) => [...pre, ...casts]);
      pageInfoRef.current = pageInfo;

      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    casts,
    farcasterUserDataObj,
    loadCasts,
  };
}
