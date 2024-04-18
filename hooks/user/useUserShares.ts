import { useCallback, useEffect, useState } from "react";
import { myShares } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { ShareInfo } from "~/services/user/types";

export default function useUserShares(address: `0x${string}`) {
  const [items, setItems] = useState<ShareInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useCallback(async () => {
    setItems([]);
    setLoading(true);
    const response = await myShares(address);
    const { code, msg, data } = response.data;
    // console.log('my share: ',data)
    if (code === ApiRespCode.SUCCESS) {
      setItems(data);
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
