import { useRef, useState } from "react";
import { getActivities } from "~/services/community/api/activity";
import {
  ActivityEntity,
  ActivityFilterType,
  ActivityOperationCatagery,
} from "~/services/community/types/activity";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";

const PAGE_SIZE = 20;

export default function useLoadOnchainActivities(props?: {
  type: ActivityFilterType;
  operationCatagery?: ActivityOperationCatagery;
}) {
  const [items, setItems] = useState<Array<ActivityEntity>>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const operationCatageryRef = useRef(props?.operationCatagery);
  const typeRef = useRef(props?.type);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const operationCatagery = operationCatageryRef.current;
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
      if (operationCatagery) {
        Object.assign(params, { operationCatagery });
      }
      if (type) {
        Object.assign(params, { type });
      }
      const resp = await getActivities(params);
      if (resp.data?.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      if (resp.data?.data?.length >= 0) {
        setItems((prev) => [...prev, ...resp.data.data]);
        pageInfoRef.current = {
          hasNextPage: resp.data.data.length >= PAGE_SIZE,
          nextPageNumber: nextPageNumber + 1,
        };
        setStatus(AsyncRequestStatus.FULFILLED);
      }
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
