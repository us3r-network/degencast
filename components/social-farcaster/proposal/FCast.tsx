import { Image, Pressable, View, ViewProps } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { useRouter } from "expo-router";
import useCastDetails from "~/hooks/social-farcaster/useCastDetails";
import { CommunityEntity } from "~/services/community/types/community";
import { Text } from "~/components/ui/text";
import { useEffect, useMemo, useState } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import EmbedImgs from "../embed/EmbedImgs";
import NeynarCastUserInfo from "./NeynarCastUserInfo";
import { getCastImageUrl } from "~/services/farcaster/api";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { Loading } from "~/components/common/Loading";
const FCastUserHeight = 20;
const FCastTextMaxHeight = 72;
const FCastLineHeight = 24;
const FCastGap = 8;
export const FCastHeight = FCastUserHeight + FCastTextMaxHeight + FCastGap;

export default function FCast({
  cast,
  proposal,
  channel,
  tokenInfo,
  className,
  readOnly,
}: ViewProps & {
  cast: NeynarCast;
  proposal?: ProposalEntity;
  channel?: CommunityEntity | null | undefined;
  tokenInfo?: AttentionTokenEntity;
  readOnly?: boolean;
}) {
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastDetails();
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  return (
    <View
      className={cn("w-full overflow-hidden", className)}
      style={{ height: FCastHeight }}
    >
      <Pressable
        className="flex w-full flex-col "
        style={{
          gap: FCastGap,
        }}
        onPress={(e) => {
          e.stopPropagation();
          if (readOnly) return;
          setCastDetailCacheData({
            cast,
            channel,
            proposal,
            tokenInfo,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        {/* body - text & embed */}
        <View
          className="w-full overflow-hidden"
          style={{ height: FCastTextMaxHeight }}
        >
          {cast.text && (
            <Text
              className=" line-clamp-3 text-foreground"
              style={{
                lineHeight: FCastLineHeight,
              }}
            >
              {cast.text}
            </Text>
          )}
          {embedImgs.length > 0 && (
            <EmbedImgs imgs={embedImgs} maxHeight={FCastTextMaxHeight} />
          )}
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

const FCastNftImageHeight = 326;
export const FCastHeightWithNftImage =
  FCastUserHeight + FCastNftImageHeight + FCastGap;
export function FCastWithNftImage({
  cast,
  proposal,
  channel,
  tokenInfo,
  className,
  readOnly,
  hideUserInfo = false,
}: ViewProps & {
  cast: NeynarCast;
  proposal?: ProposalEntity;
  channel?: CommunityEntity | null | undefined;
  tokenInfo?: AttentionTokenEntity;
  readOnly?: boolean;
  hideUserInfo?: boolean;
}) {
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastDetails();
  const imageUrl = getCastImageUrl(`0x${castHex}`);
  const [imgInfo, setImgInfo] = useState<{
    ratio: number;
  }>({ ratio: 1 });
  useEffect(() => {
    Image.getSize(imageUrl, (width, height) => {
      setImgInfo({ ratio: width / height });
    });
  }, [imageUrl]);
  const [loading, setLoading] = useState(true);

  return (
    <View
      className={cn("w-full overflow-hidden", className)}
      style={{ height: FCastHeightWithNftImage }}
    >
      <Pressable
        className="flex w-full flex-col "
        style={{
          gap: FCastGap,
        }}
        onPress={(e) => {
          e.stopPropagation();
          if (readOnly) return;
          setCastDetailCacheData({
            cast,
            channel,
            proposal,
            tokenInfo,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        <View
          style={{
            height: FCastNftImageHeight,
          }}
        >
          <AspectRatio ratio={imgInfo.ratio}>
            <ExpoImage
              source={imageUrl}
              style={{
                width: "100%",
                height: FCastNftImageHeight,
                resizeMode: "contain",
              }}
              onLoadEnd={() => setLoading(false)}
            />
          </AspectRatio>
          {loading ? (
            <View className="absolute h-full w-full items-center justify-center">
              <Loading />
            </View>
          ) : null}
        </View>

        {/* user info */}
        {!hideUserInfo && (
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
        )}
      </Pressable>
    </View>
  );
}
