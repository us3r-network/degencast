import { useEffect, useState } from "react";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import {
  DEFAULT_ORDER_PARAMS,
  OrderParams,
} from "~/features/rank/communityRankSlice";
import useCommunityRank from "~/hooks/rank/useCommunityRank";

export default function CuratorsScreen() {
  const { loading, items, load, hasMore } = useCommunityRank();
  const [orderParams, setOrderParams] =
    useState<OrderParams>(DEFAULT_ORDER_PARAMS);

  useEffect(() => {
    load(orderParams);
  }, [orderParams]);

  return (
    <PageContent>
      <CardWarper>
        
      </CardWarper>
    </PageContent>
  );
}
