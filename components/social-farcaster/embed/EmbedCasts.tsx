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
  const { navigateToCastDetail } = useCastPage();
  const { author } = cast;

  const castImg = useMemo(() => {
    const img = cast.embeds?.find((item) => isImg(item?.url))?.url;
    return img as string;
  }, [cast]);

  return (
    <Pressable
      className="w-full "
      onPress={() => {
        const castHex = getCastHex(cast);
        // router.push(`/casts/${castHex}`);
        navigateToCastDetail(castHex, {
          cast,
        });
      }}
    >
      <Card className="flex w-full cursor-pointer flex-col gap-5 rounded-[10px] border-secondary p-3">
        <View className="flex flex-row items-center gap-1">
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full">
            <AvatarImage source={{ uri: author.pfp_url }} />
            <AvatarFallback>
              <Text>{author.display_name?.slice(0, 1)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="flex-shrink-0 text-sm font-medium">
            {author.display_name}
          </Text>
          <Text className="line-clamp-1 text-xs font-normal text-secondary">
            @{author.username}
          </Text>
        </View>
        <Text className="line-clamp-6 text-base">{cast.text}</Text>
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
