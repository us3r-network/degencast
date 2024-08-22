import { useRef, useState } from "react";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getChannelSelectionFeeds } from "~/services/feeds/api/channel";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";

const PAGE_SIZE = 10;
export type SelectionFeedsItem = {
  cast: NeynarCast;
  proposal: ProposalEntity;
};
export default function useLoadChannelSelectionFeeds(props: {
  channelId: string;
}) {
  const [items, setItems] = useState<SelectionFeedsItem[]>([]);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const channelIdRef = useRef(props?.channelId || "");
  const pageInfoRef = useRef({
    hasNextPage: true,
    nextPageNumber: 1,
  });

  const loading = status === AsyncRequestStatus.PENDING;

  const loadItems = async () => {
    const channelId = channelIdRef.current;
    const { hasNextPage, nextPageNumber } = pageInfoRef.current;

    if (!channelId || hasNextPage === false) {
      return;
    }
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const params = {
        pageSize: PAGE_SIZE,
        pageNumber: nextPageNumber,
        channelId,
      };
      const resp = await getChannelSelectionFeeds(params);
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;

      setItems([...items, ...data]);

      pageInfoRef.current = {
        hasNextPage: data.length >= PAGE_SIZE,
        nextPageNumber: nextPageNumber + 1,
      };
      setStatus(AsyncRequestStatus.FULFILLED);
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    }
  };

  return {
    loading,
    items,
    loadItems,
  };
}
