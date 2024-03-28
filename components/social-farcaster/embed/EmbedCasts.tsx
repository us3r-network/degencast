import { useEffect, useMemo } from "react";
import { UserDataType } from "@farcaster/hub-web";
import { FarCastEmbedMetaCast } from "~/services/farcaster/types";
import { View, Image } from "react-native";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import useLoadEmbedCastsMetadata from "~/hooks/social-farcaster/useLoadEmbedCastsMetadata";
import { Card } from "~/components/ui/card";

export default function EmbedCasts({ casts }: { casts: Embeds["casts"] }) {
  const embedCastIds = casts.map((embed) => embed.castId);
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
    <Card className="flex w-full cursor-pointer flex-row justify-between gap-[10px] rounded-[10px] border-secondary bg-muted p-[20px]">
      <View className="w-0 flex-1">
        <View className="flex flex-row items-center gap-[10px]">
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full">
            <AvatarImage source={{ uri: userData.img }} />
            <AvatarFallback>
              <Text>Avatar Fallback</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex flex-1 flex-row items-center gap-1">
            <Text className="flex-shrink-0 text-xs font-bold">
              {userData.username}
            </Text>
            <Text className="line-clamp-1 text-xs font-normal">
              <Text className="text-secondary">@{userData.uname}</Text>·
              {dayjs(data.cast.created_at).fromNow()}
            </Text>
          </View>
        </View>
        <Text className="mt-[10px] line-clamp-3 p-0 text-primary">
          {data.cast.text}
        </Text>
      </View>
      {castImg && (
        <Image
          className="h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-[10px] object-cover"
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
