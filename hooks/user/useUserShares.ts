import { useCallback, useEffect, useState } from "react";
import { myShares } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { ShareInfo } from "~/services/user/types";

export default function useUserShares() {
  const [items, setItems] = useState<ShareInfo[]>([]);
  const fetch = useCallback(async () => {
    const response = await myShares();
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