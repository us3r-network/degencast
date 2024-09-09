import { useRef, useState } from "react";
import { getTokenActivities } from "~/services/community/api/activity";
import { ActivityEntity } from "~/services/community/types/activity";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";
import { ERC42069Token } from "~/services/trade/types";

const PAGE_SIZE = 20;

export default function useLoadTokenOnchainActivities(token: ERC42069Token) {
  const [items, setItems] = useState<Array<ActivityEntity>>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const tokenRef = useRef(token);
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const currentToken = tokenRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (hasNextPage === false || !token) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        contractAddress: currentToken.contractAddress,
        tokenId: currentToken.tokenId,
      };
      const resp = await getTokenActivities(params);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      console.log("getTokenActivities", data);
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
