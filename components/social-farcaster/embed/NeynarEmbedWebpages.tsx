import { useEffect } from "react";
import useLoadEmbedWebpagesMetadata from "~/hooks/social-farcaster/useLoadEmbedWebpagesMetadata";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import EmbedOG from "./EmbedOG";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarEmbedFrame from "./NeynarEmbedFrame";

export default function NeynarEmbedWebpages({
  webpages,
  cast,
  imgIsFixedRatio,
}: {
  webpages: Embeds["webpages"];
  cast?: NeynarCast;
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
  cast?: NeynarCast;
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
        <NeynarEmbedFrame
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
