import { useCallback, useEffect, useState } from "react";
import { myTokens } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { TokenInfoWithMetadata } from "~/services/user/types";

export default function useUserCommunityTokens() {
  const [items, setItems] = useState<TokenInfoWithMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useCallback(async () => {
    setLoading(true);
    const response = await myTokens();
    const { code, msg, data } = response.data;
    if (code === ApiRespCode.SUCCESS) {
      const tokens = data
        .map((item: any) => item.tokens)
        .flat()
        .filter((item) => item.balance > 0 && item.name !== "");
        setItems(tokens);
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
  };
}
