import { useState } from "react";
import { fetchUserBulk } from "~/services/farcaster/neynar/farcaster";
import { Author } from "~/services/farcaster/types/neynar";

export default function useUserBulk(viewer_fid?: number | undefined) {
  const [items, setItems] = useState<Array<Author>>([]);
  const [loading, setLoading] = useState(false);

  const load = async (fids: number | number[]) => {
    if (!Array.isArray(fids)) {
      fids = [fids];
    }
    setLoading(true);
    try {
      const res = await fetchUserBulk({
        fids,
        viewer_fid
      });
      const { users } = res;
      setItems(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    items,
    load,
  };
}
