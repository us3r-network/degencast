import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { useMemo } from "react";
import { formatEmbeds } from "~/utils/farcaster/getEmbeds";
import EmbedImgs from "./embed/EmbedImgs";
import EmbedCasts from "./embed/EmbedCasts";
import EmbedWebpages from "./embed/EmbedWebpages";
import EmbedVideo from "./embed/EmbedVideo";
import { cn } from "~/lib/utils";

export default function CreateCastPreviewEmbeds({
  embeds,
  className,
  ...props
}: ViewProps & {
  embeds: FarCast["embeds"];
}) {
  // embed
  const formartedEmbeds = useMemo(() => formatEmbeds(embeds), [embeds]);
  const embedImgs = formartedEmbeds.imgs;
  const embedCasts = formartedEmbeds.casts;
  const embedVideos = formartedEmbeds.videos;
  const embedWebpages = formartedEmbeds.webpages;

  return (
    <View className={cn("flex flex-col gap-5", className)} {...props}>
      {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />}
      {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />}
      {embedWebpages.length > 0 && <EmbedWebpages webpages={embedWebpages} />}
      {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
    </View>
  );
}
