import { useCallback, useEffect, useState } from "react";
import { myTokens } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { TokenInfoWithMetadata } from "~/services/user/types";

export default function useUserCommunityTokens() {
  const [tokens, setTokens] = useState<TokenInfoWithMetadata[]>([]);
  const fetch = useCallback(async () => {
    const response = await myTokens();
    const { code, msg, data } = response.data;
    if (code === ApiRespCode.SUCCESS) {
      const tokens = data
        .map((item: any) => item.tokens)
        .flat()
        .filter((item) => item.balance > 0 && item.name !== "");
      setTokens(tokens);
    } else {
      throw new Error(msg);
    }
  }, []);

  useEffect(() => {
    fetch().catch(console.error);
  }, [fetch]);

  return {
    tokens,
  };
}
