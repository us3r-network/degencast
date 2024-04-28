import { useEffect, useMemo } from "react";
import { FarCastEmbedMetaCast } from "~/services/farcaster/types";
import { View, Image } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import useLoadEmbedCastsMetadata from "~/hooks/social-farcaster/useLoadEmbedCastsMetadata";
import { Card } from "~/components/ui/card";
import { UserDataType } from "@external-types/farcaster";

export default function EmbedCasts({ casts }: { casts: Embeds["casts"] }) {
  const embedCastIds = casts.map((embed) => embed.castId || embed.cast_id);
  const { embedCastsMetadata, loadEmbedCastsMetadata } =
    useLoadEmbedCastsMetadata();
  useEffect(() => {
    loadEmbedCastsMetadata(embedCastIds);
  }, []);
  return (
    <>
      {" "}
      {[...embedCastsMetadata]
        .filter((item) => !!item.cast)
        .map((item) => {
          const castHex = Buffer.from(item.cast.hash?.data as any).toString(
            "hex",
          );
          return <EmbedCast data={item} key={castHex} />;
        })}
    </>
  );
}

function EmbedCast({ data }: { data: FarCastEmbedMetaCast }) {
  const userData = useMemo(() => {
    const img = data.user.find((u) => u.type === UserDataType.PFP)?.value;
    const username = data.user.find(
      (u) => u.type === UserDataType.DISPLAY,
    )?.value;
    const uname = data.user.find(
      (u) => u.type === UserDataType.USERNAME,
    )?.value;

    return {
      img,
      username,
      uname,
    };
  }, [data.user]);

  const castImg = useMemo(() => {
    const img = data.cast.embeds?.find((item) => isImg(item?.url))?.url;
    return img as string;
  }, [data.cast]);

  return (
    <Card className="flex w-full cursor-pointer flex-col gap-5 rounded-3xl border-secondary p-5">
      <View className="flex flex-row items-center gap-1">
        <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full">
          <AvatarImage source={{ uri: userData.img }} />
          <AvatarFallback>
            <Text>{userData.username?.slice(0, 1)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="flex-shrink-0 text-sm font-medium">
          {userData.username}
        </Text>
        <Text className="line-clamp-1 text-xs font-normal text-secondary">
          @{userData.uname}
        </Text>
      </View>
      <Text className="line-clamp-6 text-base">{data.cast.text}</Text>
      {castImg && (
        <Image
          className="w-full rounded-xl object-cover"
          source={{ uri: castImg }}
        />
      )}
    </Card>
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
