import { uniqWith } from "lodash";
import { useEffect, useState } from "react";
import { ApiRespCode } from "~/services/shared/types";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { myTokens } from "~/services/user/api";

export default function useUserCommunityTokens(address?: `0x${string}`) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<TokenWithTradeInfo[]>([]);
  const load = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const data = await myTokens(address);
      if (data.data.code === ApiRespCode.SUCCESS) {
        const tokens = data.data.data.filter(
          (item) => item.name && item.balance && Number(item.balance) > 0,
        );
        setItems(tokens);
      } else throw new Error(data.data.msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    load();
  }, [address]);

  return {
    items,
    loading,
    load,
  };
}
