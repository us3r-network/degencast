import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { CastData, getUserCasts } from "~/services/feeds/api/user";
import { ApiRespCode } from "~/services/shared/types";

const MAX_PAGE_SIZE = 20;
export default function useUserCasts(fid?: number, viewer_fid?: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<CastData[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const load = async () => {
    if (!fid) return;
    setLoading(true);
    try {
      const data = await getUserCasts({
        fid,
        viewer_fid,
        limit: MAX_PAGE_SIZE,
        cursor: cursor,
      });
      if (data?.data?.code === ApiRespCode.SUCCESS) {
        setItems((prev) =>
          uniqBy([...prev, ...(data.data.data?.casts || [])], "cast.hash"),
        );
        setCursor(data.data.data?.next?.cursor || undefined);
      } else throw new Error(data.data.msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [fid]);

  return {
    items,
    loading,
    hasMore: !!cursor,
    load,
  };
}
