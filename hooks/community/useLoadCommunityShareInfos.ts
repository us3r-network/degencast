import { useState } from "react";
import { fetchCommunityShareInfos } from "~/services/community/api/share";

export default function useLoadCommunityShareInfos() {
  const [loading, setLoading] = useState(false);
  const [shareInfos, setShareInfos] = useState({
    holders: 0,
    supply: 0,
  });

  const loadShareInfos = async (channelId: string) => {
    setLoading(true);
    try {
      const resp = await fetchCommunityShareInfos({
        channelId,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      setShareInfos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    shareInfos,
    loadShareInfos,
  };
}
