import { useCallback, useEffect, useState } from "react";
import { myTips } from "~/services/user/api";
import { ApiRespCode } from "~/services/shared/types";
import { TipsInfo } from "~/services/user/types";

export default function useUserTips() {
  const [items, setItems] = useState<TipsInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetch = useCallback(async () => {
    setLoading(true);
    const response = await myTips();
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
