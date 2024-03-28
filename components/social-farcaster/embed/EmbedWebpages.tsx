import { useEffect } from "react";
import useLoadEmbedWebpagesMetadata from "~/hooks/social-farcaster/useLoadEmbedWebpagesMetadata";
import { FarCast } from "~/services/farcaster/types";
import EmbedOG from "./EmbedOG";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import { View } from "react-native";

export default function EmbedWebpages({
  webpages,
  cast,
}: {
  webpages: Embeds["webpages"];
  cast: FarCast;
}) {
  console.log("webpages", webpages);
  return (
    <View>
      {webpages.map((item, idx) => {
        return <EmbedWebpage url={item.url} cast={cast} key={idx} />;
      })}
    </View>
  );
}

function EmbedWebpage({ url, cast }: { url: string; cast: FarCast }) {
  const { embedFrameMetadata, embedOgMetadata, loadEmbedWebpagesMetadata } =
    useLoadEmbedWebpagesMetadata();
  useEffect(() => {
    loadEmbedWebpagesMetadata([url]);
  }, []);
  return (
    <View>
      {/* {embedFrameMetada && <EmbedFrame url={url} data={embedFrameMetada} cast={cast} />} */}
      {embedOgMetadata && <EmbedOG url={url} data={embedOgMetadata} />}
    </View>
  );
}
