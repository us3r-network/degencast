import { useCallback, useState } from "react";
import {
  CommunityData,
  fetchCommunity,
} from "~/services/community/api/community";
import { ApiRespCode } from "~/services/shared/types";

export default function useLoadCommunityDetail() {
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const loadCommunity = useCallback(async (id: string | number) => {
    if (!id) {
      setCommunity(null);
      return;
    }
    try {
      setLoading(true);
      setCommunity(null);
      const res = await fetchCommunity(id);
      const { code, data, msg } = res.data;
      if (code === ApiRespCode.SUCCESS) {
        setCommunity(data);
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    community,
    loadCommunity,
  };
}
