import { CastId } from "@farcaster/hub-web";
import { View } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import getCastId from "~/utils/farcaster/getCastId";
import { UserData } from "~/utils/farcaster/user-data";
import { useMemo } from "react";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import PointBadge from "../point/PointBadge";
import FCastText from "./FCastText";
import EmbedImg from "./embed/EmbedImg";
import EmbedCast from "./embed/EmbedCast";

export default function FCast({
  cast,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
}) {
  const castId: CastId = getCastId({ cast });
  const castHex = Buffer.from(castId.hash).toString("hex");
  const userData = farcasterUserDataObj?.[cast.fid];

  // embed
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  const embedCasts = embeds.casts;
  const embedVideos = embeds.videos;
  const embedWebpages = embeds.webpages;

  return (
    <View key={cast.id} className="flex flex-col gap-5">
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
        <PointBadge value={12344} />
      </View>
      {/* body - text & embed */}
      <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
      <View className="flex flex-col gap-5 overflow-hidden">
        {embedImgs.length > 0 && <EmbedImg imgs={embedImgs} />}
        {embedCasts.length > 0 && <EmbedCast casts={embedCasts} />}
      </View>
    </View>
  );
}
