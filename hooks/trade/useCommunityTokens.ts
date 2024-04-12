import { useCallback, useEffect, useState } from "react";
import { communityTokens } from "~/services/trade/api";
import { ApiRespCode } from "~/services/shared/types";
import { TokenInfoWithStats } from "~/services/trade/types";

export default function useCommunityTokens() {
  const [items, setItems] = useState<TokenInfoWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useCallback(async () => {
    setLoading(true);
    const response = await communityTokens();
    const { code, msg, data } = response.data;
    if (code === ApiRespCode.SUCCESS) {
      setItems(data);
    } else {
      throw new Error(msg);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);

  return {
    items,
    loading,
  };
}
