import { Pressable, View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { useRouter } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { CommunityEntity } from "~/services/community/types/community";
import { Text } from "~/components/ui/text";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import NeynarCastUserInfo from "./NeynarCastUserInfo";
import FCastEmbeds from "../FCastEmbeds";
const FCastUserHeight = 20;
const FCastTextMaxHeight = 72;
const FCastLineHeight = 24;
const FCastGap = 8;
export const FCastHeight = FCastUserHeight + FCastTextMaxHeight + FCastGap;
export default function FCastWithEmbed({
  cast,
  channel,
  className,
  readOnly,
  isVisible,
}: ViewProps & {
  cast: NeynarCast;
  channel?: CommunityEntity;
  readOnly?: boolean;
  isVisible?: boolean;
}) {
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastPage();
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const hasEmbeds =
    embeds.imgs.length > 0 ||
    embeds.casts.length > 0 ||
    embeds.videos.length > 0 ||
    embeds.webpages.length > 0;
  return (
    <View className={cn("w-full overflow-hidden", className)}>
      <Pressable
        className="flex w-full flex-col "
        style={{
          gap: FCastGap,
        }}
        onPress={(e) => {
          e.stopPropagation();
          if (readOnly) return;
          setCastDetailCacheData(castHex, {
            cast: cast,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        {/* body - text & embed */}
        <View className="w-full overflow-hidden">
          {cast.text && (
            <Text className=" line-clamp-3 text-foreground">{cast.text}</Text>
          )}
          {hasEmbeds && <FCastEmbeds cast={cast} webpageImgIsFixedRatio />}
        </View>
        {/* user info */}
        <View
          className="flex flex-row items-center gap-6"
          style={{
            height: FCastUserHeight,
          }}
        >
          <NeynarCastUserInfo
            userData={cast.author}
            timestamp={cast.timestamp}
          />
        </View>
      </Pressable>
    </View>
  );
}
