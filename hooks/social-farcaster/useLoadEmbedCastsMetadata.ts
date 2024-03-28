import { useState } from "react";
import { getFarcasterEmbedCast } from "~/services/farcaster/api";
import { FarCastEmbedMetaCast } from "~/services/farcaster/types";

export default function useLoadEmbedCastsMetadataMetadata() {
  const [loading, setLoading] = useState(false);
  const [embedCastsMetadata, setEmbedCastsMetadata] = useState<
    FarCastEmbedMetaCast[]
  >([]);

  const loadEmbedCastsMetadata = async (
    embedCastIds: Array<{
      fid: number;
      hash: string;
    }>,
  ) => {
    setEmbedCastsMetadata([]);
    if (embedCastIds.length === 0) return;
    setLoading(true);
    try {
      const res = await getFarcasterEmbedCast(embedCastIds[0]);
      const { metadata: respMetadata } = res.data.data;
      const data = respMetadata.flatMap((m: any) => (m ? [m] : []));
      setEmbedCastsMetadata(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    embedCastsMetadata,
    loadEmbedCastsMetadata,
  };
}
