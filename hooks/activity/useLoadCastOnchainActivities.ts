import { useRef, useState } from "react";
import { getCastActivities } from "~/services/community/api/activity";
import { ActivityEntity } from "~/services/community/types/activity";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";

const PAGE_SIZE = 10;

export default function useLoadCastOnchainActivities(props?: {
  castHash: string;
}) {
  const [items, setItems] = useState<Array<ActivityEntity>>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const castHashRef = useRef(props?.castHash);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const castHash = castHashRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false || !castHash) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
      };
      const resp = await getCastActivities(params, castHash);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      setItems((prev) => [...prev, ...data]);
      pageInfoRef.current = {
        hasNextPage: data.length >= PAGE_SIZE,
        nextPageNumber: nextPageNumber + 1,
      };
      setStatus(AsyncRequestStatus.FULFILLED);
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    } finally {
    }
  };

  return {
    loading,
    items,
    loadItems,
  };
}
