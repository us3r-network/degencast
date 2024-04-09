import { useCallback, useEffect, useState } from "react";
import { communityTokens } from "~/services/trade/api";
import { ApiRespCode } from "~/services/shared/types";
import { TokenInfoWithStats } from "~/services/trade/types";

export default function useCommunityTokens() {
  const [items, setItems] = useState<TokenInfoWithStats[]>([]);
  const fetch = useCallback(async () => {
    const response = await communityTokens();
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
