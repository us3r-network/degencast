import { useEffect } from "react";
import useLoadEmbedWebpagesMetadata from "~/hooks/social-farcaster/useLoadEmbedWebpagesMetadata";
import { FarCast } from "~/services/farcaster/types";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import { View } from "react-native";
import EmbedOG from "./EmbedOG";
import EmbedFrame from "./EmbedFrame";

export default function EmbedWebpages({
  webpages,
  cast,
}: {
  webpages: Embeds["webpages"];
  cast?: FarCast;
}) {
  return (
    <View>
      {webpages.map((item, idx) => {
        return <EmbedWebpage url={item.url} cast={cast} key={idx} />;
      })}
    </View>
  );
}

function EmbedWebpage({ url, cast }: { url: string; cast?: FarCast }) {
  const { embedFrameMetadata, embedOgMetadata, loadEmbedWebpagesMetadata } =
    useLoadEmbedWebpagesMetadata();
  useEffect(() => {
    loadEmbedWebpagesMetadata([url]);
  }, []);
  return (
    <View>
      {embedFrameMetadata && (
        <EmbedFrame url={url} data={embedFrameMetadata} cast={cast} />
      )}
      {embedOgMetadata && <EmbedOG url={url} data={embedOgMetadata} />}
    </View>
  );
}
