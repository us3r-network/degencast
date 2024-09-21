import { uniqBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { fetchUserAssetsChannels } from "~/services/farcaster/api";
import { fetchUserFollowingChannels } from "~/services/farcaster/neynar/farcaster";
import { Channel } from "~/services/farcaster/types";
import { ApiRespCode } from "~/services/shared/types";

const MAX_PAGE_SIZE = 100;

export function useUserFollowingChannels(fid: number | undefined) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Channel[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const load = async () => {
    if (!fid) return;
    setLoading(true);
    try {
      const data = await fetchUserFollowingChannels({
        fid,
        limit: MAX_PAGE_SIZE,
        cursor,
      });
      if (data.channels.length > 0) {
        setItems((prev) => uniqBy([...prev, ...data.channels], "id"));
        setCursor(data.next.cursor);
      } else throw new Error();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [fid]);

  return {
    items,
    loading,
    hasMore: !!cursor,
    load,
  };
}

export function useUserChannels(fid: number | undefined) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Channel[]>([]);
  const load = useCallback(async () => {
    if (!fid) return;
    try {
      setLoading(true);
      const data = await fetchUserAssetsChannels({
        fid,
      });
      if (data.data.code === ApiRespCode.SUCCESS) setItems(data.data.data);
      else throw new Error(data.data.msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fid]);

  useEffect(() => {
    load();
  }, [fid]);

  return {
    items,
    loading,
    load,
  };
}
