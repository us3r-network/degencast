import { useRef, useState } from "react";
import { DEFAULT_ORDER_PARAMS } from "~/features/rank/curatorRankSlice";
import { fetchRankCurators } from "~/services/rank/api";
import { CuratorEntity } from "~/services/rank/types";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";

const PAGE_SIZE = 10;
export default function useLoadChannelCurators(props: { channelId: string }) {
  const [items, setItems] = useState<CuratorEntity[]>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const channelIdRef = useRef(props?.channelId || "");
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });
  const [pageInfo, setPageInfo] = useState(pageInfoRef.current);

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const channelId = channelIdRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false || !channelId) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        ...DEFAULT_ORDER_PARAMS,
      };
      const resp = await fetchRankCurators(params, channelId);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;

      setItems([...items, ...data]);

      pageInfoRef.current = {
        hasNextPage: data.length >= PAGE_SIZE,
        nextPageNumber: nextPageNumber + 1,
      };
      setPageInfo({ ...pageInfoRef.current });
      setStatus(AsyncRequestStatus.FULFILLED);
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    }
  };

  return {
    loading,
    items,
    pageInfo,
    loadItems,
  };
}
