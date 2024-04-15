import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import FCastText from "./FCastText";
import EmbedImgs from "./embed/EmbedImgs";
import EmbedCasts from "./embed/EmbedCasts";
import EmbedWebpages from "./embed/EmbedWebpages";
import EmbedVideo from "./embed/EmbedVideo";
import UserGlobalPoints from "../point/UserGlobalPoints";
import { cn } from "~/lib/utils";

export default function FCast({
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
}) {
  const userData = farcasterUserDataObj?.[cast.fid];

  // embed
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  const embedCasts = embeds.casts;
  const embedVideos = embeds.videos;
  const embedWebpages = embeds.webpages;

  return (
    <View
      key={cast.id}
      className={cn("flex w-full flex-col gap-5", className)}
      {...props}
    >
      {/* header - user info */}
      <View className="flex flex-row items-center justify-between gap-6">
        <View className="flex flex-1 flex-row items-center gap-1">
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full object-cover">
            <AvatarImage source={{ uri: userData?.pfp }} />
            <AvatarFallback>
              <Text>{userData?.display.slice(0, 1)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="line-clamp-1 text-base font-medium">
            {userData?.display}
          </Text>
          <Text className="text-sm text-[#A36EFE]">@{userData?.userName}</Text>
        </View>
        <UserGlobalPoints />
      </View>
      {/* body - text & embed */}
      <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
      <View className="flex flex-col gap-5">
        {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />}
        {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />}
        {embedWebpages.length > 0 && (
          <EmbedWebpages webpages={embedWebpages} cast={cast} />
        )}
        {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
      </View>
    </View>
  );
}
