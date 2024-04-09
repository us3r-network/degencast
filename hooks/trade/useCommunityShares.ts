import { useCallback, useEffect, useState } from "react";
import { communityShares } from "~/services/trade/api";
import { ApiRespCode } from "~/services/shared/types";
import { ShareInfo } from "~/services/trade/types";

export default function useCommunityShares() {
  const [items, setItems] = useState<ShareInfo[]>([]);
  const fetch = useCallback(async () => {
    const response = await communityShares();
    const { code, msg, data } = response.data;
    if (code === ApiRespCode.SUCCESS) {
        setItems(data);
    } else {
      throw new Error(msg);
    }
  }, []);

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);

  return {
    items,
  };
}
