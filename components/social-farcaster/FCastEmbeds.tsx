import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import EmbedImgs from "./embed/EmbedImgs";
import EmbedCasts from "./embed/EmbedCasts";
import EmbedWebpages from "./embed/EmbedWebpages";
import EmbedVideo from "./embed/EmbedVideo";
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarEmbedWebpages from "./embed/NeynarEmbedWebpages";
import { isNeynarCast } from "~/utils/farcaster/cast-utils";

export default function FCastEmbeds({
  cast,
  className,
  webpageImgIsFixedRatio,
  ...props
}: ViewProps & {
  cast: FarCast | NeynarCast;
  webpageImgIsFixedRatio?: boolean;
}) {
  // embed
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  const embedCasts = embeds.casts;
  const embedVideos = embeds.videos;
  const embedWebpages = embeds.webpages;
  const isNeynar = isNeynarCast(cast);
  return (
    <View className={cn("flex w-full flex-col gap-5", className)} {...props}>
      {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />}
      {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />}
      {embedWebpages.length > 0 &&
        (isNeynar ? (
          <NeynarEmbedWebpages
            webpages={embedWebpages}
            cast={cast as NeynarCast}
            imgIsFixedRatio={webpageImgIsFixedRatio}
          />
        ) : (
          <EmbedWebpages
            webpages={embedWebpages}
            cast={cast as FarCast}
            imgIsFixedRatio={webpageImgIsFixedRatio}
          />
        ))}
      {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
    </View>
  );
}
