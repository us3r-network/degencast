import { useCallback, useState } from "react";
import { fetchCastWithHash } from "~/services/farcaster/neynar/farcaster";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export default function useLoadNeynarCastDetail() {
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState<NeynarCast>();
  const loadNeynarCastDetail = useCallback(async (castHash: string) => {
    if (!castHash) {
      return;
    }
    try {
      setLoading(true);
      const { cast } = await fetchCastWithHash({ hash: castHash });
      setCast(cast);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    cast,
    loadNeynarCastDetail,
  };
}
