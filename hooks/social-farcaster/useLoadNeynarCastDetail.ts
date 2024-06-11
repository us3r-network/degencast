import { useCallback, useState } from "react";
import { fetchCastWithHash } from "~/services/farcaster/neynar/farcaster";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import useFarcasterAccount from "./useFarcasterAccount";

export default function useLoadNeynarCastDetail() {
  const [loading, setLoading] = useState(false);
  const [cast, setCast] = useState<NeynarCast>();
  const { currFid } = useFarcasterAccount();
  const loadNeynarCastDetail = useCallback(
    async (castHash: string) => {
      if (!castHash) {
        return;
      }
      try {
        setLoading(true);
        const { cast } = await fetchCastWithHash({
          hash: castHash,
          viewer_fid: Number(currFid),
        });
        setCast(cast);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [currFid],
  );
  return {
    loading,
    cast,
    loadNeynarCastDetail,
  };
}
