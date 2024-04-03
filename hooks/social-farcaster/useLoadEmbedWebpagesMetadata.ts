import { Frame } from "frames.js";
import { useState } from "react";
import { getFarcasterEmbedMetadataV2 } from "~/services/farcaster/api";

export default function useLoadEmbedWebpagesMetadata() {
  const [loading, setLoading] = useState(false);
  const [frame, setFrame] = useState<Frame>();
  const [og, setOG] = useState<any>();

  const loadEmbedWebpagesMetadata = async (embedUrls: Array<string>) => {
    setFrame(undefined);
    setOG(null);
    if (embedUrls.length === 0) return;
    setLoading(true);
    try {
      const res = await getFarcasterEmbedMetadataV2(embedUrls);
      const { metadata: respMetadata } = res.data.data;
      if (!respMetadata || !respMetadata[0]) return;

      const { ogData, frame: frameData } = respMetadata[0];

      if (frameData && frameData.version) {
        setFrame(frameData);
      } else {
        setOG(ogData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    embedFrameMetadata: frame,
    embedOgMetadata: og,
    loadEmbedWebpagesMetadata,
  };
}
