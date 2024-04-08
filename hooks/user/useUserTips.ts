import { useCallback, useEffect, useState } from "react";
import { myTips } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { TipsInfo } from "~/services/user/types";

export default function useUserTips() {
  const [items, setItems] = useState<TipsInfo[]>([]);
  const fetch = useCallback(async () => {
    const response = await myTips();
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
