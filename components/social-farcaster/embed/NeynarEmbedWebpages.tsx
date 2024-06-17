import { useEffect } from "react";
import useLoadEmbedWebpagesMetadata from "~/hooks/social-farcaster/useLoadEmbedWebpagesMetadata";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import EmbedOG from "./EmbedOG";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarEmbedFrame from "./NeynarEmbedFrame";
import { neynarFrameDataToFrameJsData } from "~/utils/farcaster/frame";

export default function NeynarEmbedWebpages({
  webpages,
  cast,
  imgIsFixedRatio,
}: {
  webpages: Embeds["webpages"];
  cast: NeynarCast;
  imgIsFixedRatio?: boolean;
}) {
  const { frames: castFrames } = cast;
  const frames = castFrames?.map((frame) => ({
    ...neynarFrameDataToFrameJsData(frame),
    url: frame.frames_url,
  }));
  const ogs =
    castFrames && castFrames?.length > 0
      ? webpages.filter(
          (item) => !castFrames?.find((f) => f.frames_url === item.url),
        )
      : webpages;
  return (
    <>
      {frames?.map((item, idx) => {
        return (
          <NeynarEmbedFrame
            key={idx.toString()}
            url={item.url}
            data={item}
            cast={cast}
            imgIsFixedRatio={imgIsFixedRatio}
          />
        );
      })}
      {ogs.map((item, idx) => {
        return <EmbedWebpage url={item.url} key={idx} />;
      })}
    </>
  );
}

function EmbedWebpage({ url }: { url: string }) {
  const { embedOgMetadata, loadEmbedWebpagesMetadata } =
    useLoadEmbedWebpagesMetadata();
  useEffect(() => {
    loadEmbedWebpagesMetadata([url]);
  }, []);
  return <>{embedOgMetadata && <EmbedOG url={url} data={embedOgMetadata} />}</>;
}
