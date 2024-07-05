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
import { NeynarCast } from "~/services/farcaster/types/neynar";
import {
  getCastFid,
  getCastHex,
  isNeynarCast,
} from "~/utils/farcaster/cast-utils";
import NeynarEmbedWebpages from "../embed/NeynarEmbedWebpages";

export default function FcastMiniCard({
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
}) {
  const castHex = getCastHex(cast);
  const castFid = getCastFid(cast);
  const userData = farcasterUserDataObj?.[castFid];

  // embed
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const embedImgs = embeds.imgs;
  const embedCasts = embeds.casts;
  const embedVideos = embeds.videos;
  const embedWebpages = embeds.webpages;

  const isNeynar = isNeynarCast(cast);

  const userInfo = {
    pfp: isNeynar ? (cast as NeynarCast).author.pfp_url : userData?.pfp,
    username: isNeynar
      ? (cast as NeynarCast).author.username
      : userData?.userName,
    display: isNeynar
      ? (cast as NeynarCast).author.display_name
      : userData?.display,
    power_badge: isNeynar ? (cast as NeynarCast).author.power_badge : false,
  };
  return (
    <Card
      key={castHex}
      className={cn(
        "relative flex min-h-36 flex-col gap-5 overflow-hidden border-secondary/10",
        " sm:min-h-64",
        className,
      )}
      {...props}
    >
      {/* user info */}
      <View className=" absolute bottom-0 left-0 z-20 w-full flex-row items-center gap-1 p-2">
        <Avatar alt={"Avatar"} className=" h-4 w-4 rounded-full object-cover">
          <AvatarImage source={{ uri: userInfo.pfp }} />
          <AvatarFallback>
            <Text>{userInfo.username}</Text>
          </AvatarFallback>
        </Avatar>

        <Text className="line-clamp-1 text-xs font-medium">
          {userInfo.display}
        </Text>
        {userInfo.power_badge && (
          <Image
            source={require("~/assets/images/active-badge.webp")}
            style={{ width: 12, height: 12 }}
          />
        )}
      </View>
      {/* body - text & embed */}
      {embedImgs.length === 0 && !!cast.text && (
        <View className="p-2 pb-6">
          {/* <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} /> */}
          <Text
            className={cn(
              " line-clamp-4 text-xs leading-6",
              embedImgs.length === 0 && " sm:line-clamp-6",
            )}
          >
            {cast.text}
          </Text>
        </View>
      )}
      {embedImgs.length > 0 && (
        <Image
          className="z-10 h-full w-full object-contain"
          source={{ uri: embedImgs[0].url }}
        />
      )}

      {!cast.text && (
        <View className="z-10 flex flex-col gap-5 overflow-hidden">
          {/* {embedImgs.length > 0 && <EmbedImgs imgs={embedImgs} />} */}

          {embedCasts.length > 0 && <EmbedCasts casts={embedCasts} />}
          {embedWebpages.length > 0 &&
            (isNeynar ? (
              <NeynarEmbedWebpages
                webpages={embedWebpages}
                cast={cast as NeynarCast}
              />
            ) : (
              <EmbedWebpages webpages={embedWebpages} cast={cast as FarCast} />
            ))}
          {embedVideos.length > 0 && <EmbedVideo uri={embedVideos[0]?.url} />}
        </View>
      )}
    </Card>
  );
}
