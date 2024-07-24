import { useRef, useState } from "react";
import {
  getActivities,
} from "~/services/community/api/activity";
import { ActivityEntity, ActivityFilterType } from "~/services/community/types/activity";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { ERC42069Token } from "~/services/trade/types";

const PAGE_SIZE = 20;

export default function useLoadOnchainActivities(props?: {
  channelId?: string;
  token?: ERC42069Token;
  type?: ActivityFilterType;
}) {
  const [items, setItems] = useState<Array<ActivityEntity>>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const channelIdRef = useRef(props?.channelId || "");
  const typeRef = useRef(props?.type || "");
  const tokenRef = useRef(props?.token || undefined);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const channelId = channelIdRef.current;
    const token = tokenRef.current;
    const type = typeRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
      };
      if (channelId) {
        Object.assign(params, { channelId });
      }
      if (token) {
        Object.assign(params, { token });
      }
      if (type) {
        Object.assign(params, { type });
      }
      const resp = await getActivities(params);
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
