import { View, ViewProps, Image } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import FCastText from "../FCastText";
import EmbedImgs from "../embed/EmbedImgs";
import EmbedCasts from "../embed/EmbedCasts";
import EmbedWebpages from "../embed/EmbedWebpages";
import EmbedVideo from "../embed/EmbedVideo";
import { Card } from "~/components/ui/card";

export default function FcastMiniCard({
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
}) {
  const userData = farcasterUserDataObj?.[cast.fid];

  // embed
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  const embedCasts = embeds.casts;
  const embedVideos = embeds.videos;
  const embedWebpages = embeds.webpages;

  return (
    <Card
      key={cast.id}
      className={cn(
        "relative flex min-h-36 flex-col gap-5 overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* user info */}
      <View className=" absolute bottom-0 left-0 w-full flex-row items-center gap-1 p-2">
        <Avatar alt={"Avatar"} className=" h-4 w-4 rounded-full object-cover">
          <AvatarImage source={{ uri: userData?.pfp }} />
          <AvatarFallback>
            <Text>{userData?.userName}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="line-clamp-1 text-xs font-medium">
          {userData?.display}
        </Text>
      </View>
      {/* body - text & embed */}
      {!!cast.text && (
        <View className="p-2 pb-6">
          {/* <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} /> */}
          <Text className=" line-clamp-4 text-xs leading-6">{cast.text}</Text>
        </View>
      )}
      {embedImgs.length > 0 && (
        <Image
          className="h-full w-full object-cover"
          source={{ uri: embedImgs[0].url }}
        />
      )}

      {!cast.text && (
        <View className="flex flex-col gap-5 overflow-hidden">
          {/* {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />} */}

          {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />}
          {embedWebpages.length > 0 && (
            <EmbedWebpages webpages={embedWebpages} cast={cast} />
          )}
          {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
        </View>
      )}
    </Card>
  );
}
