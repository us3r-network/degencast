import { useEffect, useMemo } from "react";
import { FarCast, FarCastEmbedMetaCast } from "~/services/farcaster/types";
import { View, Image, Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Embeds } from "~/utils/farcaster/getEmbeds";
import useLoadEmbedCastsMetadata from "~/hooks/social-farcaster/useLoadEmbedCastsMetadata";
import { Card } from "~/components/ui/card";
import { UserDataType } from "@external-types/farcaster";
import useCastPage from "~/hooks/social-farcaster/useCastPage";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";
import { getCastHex } from "~/utils/farcaster/cast-utils";

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
  const { navigateToCastDetail } = useCastPage();
  const { cast, user } = data;
  const userDataObj = useMemo(() => userDataObjFromArr(user), [user]);
  const userData = userDataObj[cast.fid as string];

  const castImg = useMemo(() => {
    const img = data.cast.embeds?.find((item) => isImg(item?.url))?.url;
    return img as string;
  }, [data.cast]);

  return (
    <Pressable
      className="w-full "
      onPress={() => {
        const castHex = getCastHex(cast as FarCast);
        // router.push(`/casts/${castHex}`);
        navigateToCastDetail(castHex, {
          cast: cast as FarCast,
          farcasterUserDataObj: userDataObj,
        });
      }}
    >
      <Card className="flex w-full cursor-pointer flex-col gap-5 rounded-[10px] border-secondary p-3">
        <View className="flex flex-row items-center gap-1">
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full">
            <AvatarImage source={{ uri: userData.pfp }} />
            <AvatarFallback>
              <Text>{userData.display?.slice(0, 1)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="flex-shrink-0 text-sm font-medium">
            {userData.display}
          </Text>
          <Text className="line-clamp-1 text-xs font-normal text-secondary">
            @{userData.userName}
          </Text>
        </View>
        <Text className="line-clamp-6 text-base">{data.cast.text}</Text>
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
