import { useCallback, useRef, useState } from "react";
import { upsertManyToReactions } from "~/features/cast/castReactionsSlice";
import { getFarcasterCastComments } from "~/services/farcaster/api";
import { FarCast } from "~/services/farcaster/types";
import { ApiRespCode } from "~/services/shared/types";
import { useAppDispatch } from "~/store/hooks";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
import { viewerContextsFromCasts } from "~/utils/farcaster/viewerContext";

const PAGE_SIZE = 20;
export default function useLoadCastComments(castHex: string) {
  const dispatch = useAppDispatch();
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const [comments, setComments] =
    useState<{ data: FarCast; platform: "farcaster" }[]>();
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: true,
    nextPageNumber: 1,
  });
  const pageInfoRef = useRef(pageInfo);
  const loadCastComments = useCallback(async () => {
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;
    if (!hasNextPage) {
      return;
    }
    if (!castHex) {
      setComments([]);
      return;
    }
    try {
      setLoading(true);
      const res = await getFarcasterCastComments(castHex, {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
      });
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        const { farcasterUserData: farcasterUserDataTmp, casts: newComments } =
          data;
        const viewerContexts = viewerContextsFromCasts(
          newComments.map((item) => item.data),
        );
        dispatch(upsertManyToReactions(viewerContexts));

        const userDataObj = userDataObjFromArr(farcasterUserDataTmp);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        setComments((pre) => [...(pre || []), ...newComments]);

        pageInfoRef.current = {
          hasNextPage: newComments.length === PAGE_SIZE,
          nextPageNumber: nextPageNumber + 1,
        };
        setPageInfo({ ...pageInfoRef.current });
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFirstLoaded(true);
      setLoading(false);
    }
  }, [castHex]);
  return {
    firstLoaded,
    loading,
    comments,
    farcasterUserDataObj,
    pageInfo,
    loadCastComments,
  };
}
