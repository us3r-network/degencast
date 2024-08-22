import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import FCastEmbeds from "./FCastEmbeds";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { useMemo } from "react";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarCastText from "./NeynarCastText";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import NeynarCastUserInfo from "./proposal/NeynarCastUserInfo";

export default function FCast({
  cast,
  className,
  webpageImgIsFixedRatio,
}: ViewProps & {
  cast: NeynarCast;
  webpageImgIsFixedRatio?: boolean;
}) {
  const castHex = getCastHex(cast);
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const hasEmbeds =
    embeds.imgs.length > 0 ||
    embeds.casts.length > 0 ||
    embeds.videos.length > 0 ||
    embeds.webpages.length > 0;
  return (
    <View key={castHex} className={cn("flex w-full flex-col gap-4", className)}>
      {/* text & embed */}
      <NeynarCastText cast={cast as NeynarCast} />

      {hasEmbeds && (
        <FCastEmbeds
          cast={cast}
          webpageImgIsFixedRatio={webpageImgIsFixedRatio}
        />
      )}
      {/* user info */}
      <View className="flex flex-row items-center gap-6">
        <NeynarCastUserInfo userData={cast.author} timestamp={cast.timestamp} />
      </View>
    </View>
  );
}
