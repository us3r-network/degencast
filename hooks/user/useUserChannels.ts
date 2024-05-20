import { useEffect, useRef, useState } from "react";
import { fetchUserChannels } from "~/services/farcaster/neynar/farcaster";
import { Channel } from "~/services/farcaster/types/neynar";

const PAGE_SIZE = 30;

export default function useUserChannels() {
  const [items, setItems] = useState<Array<Channel>>([]);
  const [loading, setLoading] = useState(false);
  const cursor = useRef<string>();

  const load = async (fid: number) => {
    setLoading(true);
    try {
      const res = await fetchUserChannels({
        fid,
        limit: PAGE_SIZE,
        cursor: cursor.current,
      });
      const { channels, next } = res;
      setItems((pre) => [...pre, ...channels]);
      cursor.current = next.cursor;
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
    hasNext: !!cursor.current,
  };
}
