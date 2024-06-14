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
  imgIsFixedRatio,
}: {
  webpages: Embeds["webpages"];
  cast?: FarCast;
  imgIsFixedRatio?: boolean;
}) {
  return (
    <>
      {webpages.map((item, idx) => {
        return (
          <EmbedWebpage
            url={item.url}
            cast={cast}
            key={idx}
            imgIsFixedRatio={imgIsFixedRatio}
          />
        );
      })}
    </>
  );
}

function EmbedWebpage({
  url,
  cast,
  imgIsFixedRatio,
}: {
  url: string;
  cast?: FarCast;
  imgIsFixedRatio?: boolean;
}) {
  const { embedFrameMetadata, embedOgMetadata, loadEmbedWebpagesMetadata } =
    useLoadEmbedWebpagesMetadata();
  useEffect(() => {
    loadEmbedWebpagesMetadata([url]);
  }, []);
  return (
    <>
      {embedFrameMetadata && (
        <EmbedFrame
          url={url}
          data={embedFrameMetadata}
          cast={cast}
          imgIsFixedRatio={imgIsFixedRatio}
        />
      )}
      {embedOgMetadata && <EmbedOG url={url} data={embedOgMetadata} />}
    </>
  );
}
