import { useRef, useState } from "react";
import { fetchCommunityShares } from "~/services/community/api/share";

const PAGE_SIZE = 20;

export default function useLoadCommunityMembersShare() {
  const [membersShare, setMembersShare] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });
  const [pageInfo, setPageInfo] = useState(pageInfoRef.current);
  const channelIdRef = useRef("");

  const loadMembersShare = async (channelId: string) => {
    if (channelId !== channelIdRef.current) {
      channelIdRef.current = channelId;
      setMembersShare([]);
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
      const resp = await fetchCommunityShares({
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        channelId: channelIdRef.current,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      setMembersShare((prev) => [...prev, ...(data || [])]);

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
    membersShare,
    pageInfo,
    loadMembersShare,
  };
}
