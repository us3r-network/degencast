import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFarcasterTrending } from "~/services/farcaster/api";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

const FIRST_PAGE_SIZE = 20;
const LOAD_MORE_CRITICAL_NUM = 10;
const NEXT_PAGE_SIZE = 10;
const SHOW_ITEMS_NUM = 3;

export default function useLoadExploreCasts() {
  const [casts, setCasts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const pageInfoRef = useRef({
    hasNextPage: true,
    endIndex: 0,
  });

  const loadCasts = async () => {
    const { hasNextPage, endIndex } = pageInfoRef.current;
    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterTrending({
        start: endIndex,
        end: endIndex === 0 ? FIRST_PAGE_SIZE : endIndex + NEXT_PAGE_SIZE,
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

  const removeCast = useCallback((castId: string) => {
    console.log("removeCast", castId);
    setCasts((pre) => pre.filter((cast) => cast?.data?.id !== castId));
  }, []);

  useEffect(() => {
    if (casts.length <= LOAD_MORE_CRITICAL_NUM) {
      loadCasts();
    }
  }, [casts]);

  const showCasts = useMemo(() => casts.slice(0, SHOW_ITEMS_NUM), [casts]);

  return {
    loading,
    showCasts,
    farcasterUserDataObj,
    removeCast,
  };
}
