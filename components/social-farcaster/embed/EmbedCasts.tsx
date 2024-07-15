import { useEffect, useMemo } from "react";
import { View, Image, Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import useLoadEmbedCastsMetadata from "~/hooks/social-farcaster/useLoadEmbedCastsMetadata";
import { Card } from "~/components/ui/card";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { Link, useRouter } from "expo-router";

export default function EmbedCasts({ casts }: { casts: Embeds["casts"] }) {
  const embedCastIds = casts.map((embed) => embed.castId || embed.cast_id);
  const { embedCastsMetadata, loadEmbedCastsMetadata } =
    useLoadEmbedCastsMetadata({ embedCastIds });
  useEffect(() => {
    loadEmbedCastsMetadata();
  }, [loadEmbedCastsMetadata]);
  if (!embedCastsMetadata) return null;

  return <EmbedCast cast={embedCastsMetadata} />;
}

function EmbedCast({ cast }: { cast: NeynarCast }) {
  const router = useRouter();
  const { setCastDetailCacheData } = useCastPage();
  const { author } = cast;

  const castImg = useMemo(() => {
    const img = cast.embeds?.find((item) => isImg(item?.url))?.url;
    return img as string;
  }, [cast]);

  return (
    <Pressable
      className="w-full "
      onPress={(e) => {
        e.stopPropagation();
        const castHex = getCastHex(cast);
        setCastDetailCacheData(castHex, {
          cast,
        });
        router.push(`/casts/${getCastHex(cast)}`);
      }}
    >
      <Card className="flex w-full cursor-pointer flex-col gap-5 rounded-[10px] border-secondary p-3">
        <Link
          className="flex flex-row items-center gap-1"
          href={`/u/${author.fid}`}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full">
            <AvatarImage source={{ uri: author.pfp_url }} />
            <AvatarFallback>
              <Text>{author.display_name?.slice(0, 1)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="flex-shrink-0 font-bold hover:underline">
            {author.display_name}
          </Text>
          {author?.power_badge && (
            <Image
              source={require("~/assets/images/active-badge.webp")}
              style={{ width: 12, height: 12 }}
            />
          )}
          <Text className="line-clamp-1 text-secondary hover:underline">
            @{author.username}
          </Text>
        </Link>
        <Text className="line-clamp-6">{cast.text}</Text>
        {castImg && (
          <Image
            className="w-full rounded-[10px] object-cover"
            source={{ uri: castImg }}
          />
        )}
      </Card>
    </Pressable>
  );
}

function isImg(url?: string) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".gif")
  );
}
