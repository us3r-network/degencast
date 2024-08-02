import { Pressable, View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarCastUserInfo from "~/components/social-farcaster/NeynarCastUserInfo";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { useRouter } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import { CommunityEntity } from "~/services/community/types/community";
import { Text } from "~/components/ui/text";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import EmbedImgs from "../embed/EmbedImgs";
const FCastUserHeight = 42;
const FCastTextHeight = 66;
const FCastGap = 16;
export const FCastHeight = FCastUserHeight + FCastTextHeight + FCastGap;
export default function FCast({
  cast,
  channel,
  className,
  readOnly,
}: ViewProps & {
  cast: NeynarCast;
  channel?: CommunityEntity;
  readOnly?: boolean;
}) {
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastPage();
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  return (
    <View
      className={cn("w-full overflow-hidden", className)}
      style={{ height: FCastHeight }}
    >
      <Pressable
        className="flex w-full flex-col gap-4 "
        onPress={(e) => {
          e.stopPropagation();
          if (readOnly) return;
          setCastDetailCacheData(castHex, {
            cast: cast,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        {/* header - user info */}
        <View
          className="flex flex-row items-center gap-6"
          style={{
            height: FCastUserHeight,
          }}
        >
          <View className="flex-1">
            <NeynarCastUserInfo
              userData={cast.author}
              timestamp={cast.timestamp}
            />
          </View>
          <FCastExploreActions cast={cast} communityInfo={channel as any} />
        </View>
        {/* body - text & embed */}
        {cast.text && (
          <Text
            className=" line-clamp-3 leading-[22px] text-foreground"
            style={{
              height: FCastTextHeight,
            }}
          >
            {cast.text}
          </Text>
        )}
        {embedImgs.length > 0 && (
          <EmbedImgs imgs={embedImgs} maxHeight={FCastTextHeight} />
        )}
      </Pressable>
    </View>
  );
}
