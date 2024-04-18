import { useCallback, useEffect, useState } from "react";
import { myTokens } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { TokenInfoWithMetadata } from "~/services/user/types";

export default function useUserCommunityTokens(address: `0x${string}`) {
  const [items, setItems] = useState<TokenInfoWithMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useCallback(async () => {
    setItems([]);
    setLoading(true);
    const response = await myTokens(address);
    const { code, msg, data } = response.data;
    if (code === ApiRespCode.SUCCESS) {
      const tokens = data.filter(
        (item) =>
          item.name &&
          item.balance &&
          Number(item.balance) > 0 &&
          item.tradeInfo?.channel,
      );
      setItems(tokens);
    } else {
      throw new Error(msg);
    }
    setLoading(false);
  }, [address]);

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);

  return {
    loading,
    items,
  };
}
