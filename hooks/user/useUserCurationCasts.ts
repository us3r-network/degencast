import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { CastData, getUserCurationCasts } from "~/services/feeds/api/user";
import { ApiRespCode } from "~/services/shared/types";

const MAX_PAGE_SIZE = 20;
export default function useUserCasts(fid?: number, viewer_fid?: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<CastData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const load = async () => {
    if (!fid) return;
    setLoading(true);
    try {
      const data = await getUserCurationCasts({
        fid,
        viewer_fid,
        pageSize: MAX_PAGE_SIZE,
        pageNumber: pageNumber,
      });
      if (data?.data?.code === ApiRespCode.SUCCESS) {
        const casts = data.data.data || [];
        setItems((prev) => uniqBy([...prev, ...casts], "cast.hash"));
        if (casts.length === MAX_PAGE_SIZE) setPageNumber((prev) => prev + 1);
        else setPageNumber(0);
      } else throw new Error(data.data.msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setPageNumber(1);
    load();
  }, [fid]);

  return {
    items,
    loading,
    hasMore: pageNumber > 0,
    load,
  };
}
