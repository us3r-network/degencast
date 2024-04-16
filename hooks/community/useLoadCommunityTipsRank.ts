import { useRef, useState } from "react";
import { fetchCommunityTipsRank } from "~/services/community/api/tips";

const PAGE_SIZE = 20;
export default function useLoadCommunityTipsRank() {
  const [tipsRank, setTipsRank] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });
  const [pageInfo, setPageInfo] = useState(pageInfoRef.current);
  const channelIdRef = useRef("");

  const loadTipsRank = async (channelId: string) => {
    if (channelId !== channelIdRef.current) {
      channelIdRef.current = channelId;
      setTipsRank([]);
      pageInfoRef.current = {
        hasNextPage: true,
        nextPageNumber: 1,
      };
    }
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await fetchCommunityTipsRank({
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        channelId: channelIdRef.current,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      setTipsRank((pre) => [...pre, ...(data || [])]);

      const hasNextPage = data?.length >= PAGE_SIZE;
      pageInfoRef.current.hasNextPage = hasNextPage;
      pageInfoRef.current.nextPageNumber += 1;
      setPageInfo({ ...pageInfoRef.current });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    tipsRank,
    pageInfo,
    loadTipsRank,
  };
}
