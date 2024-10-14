import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { CastData, getUserCurationCasts } from "~/services/feeds/api/user";
import { ApiRespCode } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { getReactionsCountAndViewerContexts } from "~/utils/farcaster/reactions";

const MAX_PAGE_SIZE = 20;
export default function useUserCurationCasts(fid?: number, viewer_fid?: number) {
  const dispatch = useAppDispatch();
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
        const reactions = getReactionsCountAndViewerContexts(
          casts.map((i) => i.cast),
        );
        dispatch(upsertManyToReactions(reactions));
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
