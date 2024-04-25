import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { formatEmbeds } from "~/utils/farcaster/getEmbeds";
import EmbedImgs from "./embed/EmbedImgs";
import EmbedWebpages from "./embed/EmbedWebpages";
import EmbedVideo from "./embed/EmbedVideo";

export default function NeynarEmbeds({
  embeds,
  className,
  ...props
}: ViewProps & {
  embeds: {
    url?: string;
    cast_id?: {
      fid: number;
      hash: string;
    };
  }[];
}) {
  const embedsData = formatEmbeds(embeds);
  const embedImgs = embedsData.imgs;
  //   const embedCasts = embeds.casts;
  const embedVideos = embedsData.videos;
  const embedWebpages = embedsData.webpages;

  console.log("embedImgs", embedImgs, embedVideos, embedWebpages);
  return (
    <View className={cn("flex flex-col gap-5", className)} {...props}>
      {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />}
      {/* {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />} */}
      {/* {embedWebpages.length > 0 && (
        <EmbedWebpages webpages={embedWebpages} cast={cast} />
      )} */}
      {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
    </View>
  );
  return null;
}
