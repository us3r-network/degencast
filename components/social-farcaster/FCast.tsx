import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import FCastText from "./FCastText";
import { cn } from "~/lib/utils";
import FCastUserInfo from "./FCastUserInfo";
import FCastEmbeds from "./FCastEmbeds";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { useMemo } from "react";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarCastText from "./NeynarCastText";
import NeynarCastUserInfo from "./NeynarCastUserInfo";
import {
  getCastCreateAtTimestamp,
  getCastFid,
  getCastHex,
  isNeynarCast,
} from "~/utils/farcaster/cast-utils";
import { Text } from "../ui/text";
import dayjs from "dayjs";

export default function FCast({
  cast,
  farcasterUserDataObj,
  className,
  hidePoints = true,
  webpageImgIsFixedRatio,
  viewMoreWordLimits,
  ...props
}: ViewProps & {
  cast: FarCast | NeynarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  hidePoints?: boolean;
  webpageImgIsFixedRatio?: boolean;
  viewMoreWordLimits?: number;
}) {
  const castHex = getCastHex(cast);
  const castFid = getCastFid(cast);
  const userData = farcasterUserDataObj?.[castFid];
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const hasEmbeds =
    embeds.imgs.length > 0 ||
    embeds.casts.length > 0 ||
    embeds.videos.length > 0 ||
    embeds.webpages.length > 0;
  const isNeynar = isNeynarCast(cast);
  return (
    <View
      key={castHex}
      className={cn("flex w-full flex-col gap-5", className)}
      {...props}
    >
      {/* header - user info */}
      <View className="flex flex-row items-center">
        {isNeynar ? (
          <NeynarCastUserInfo userData={(cast as NeynarCast).author} />
        ) : (
          <FCastUserInfo userData={userData!} />
        )}
        <Text className=" text-xs font-normal text-secondary">
          {" "}
          · {dayjs(getCastCreateAtTimestamp(cast)).fromNow(true)}
        </Text>
      </View>
      {/* body - text & embed */}
      {isNeynar ? (
        <NeynarCastText cast={cast as NeynarCast} />
      ) : (
        <FCastText
          cast={cast as FarCast}
          farcasterUserDataObj={farcasterUserDataObj}
          viewMoreWordLimits={hasEmbeds ? viewMoreWordLimits : undefined}
        />
      )}

      {hasEmbeds && (
        <FCastEmbeds
          cast={cast}
          webpageImgIsFixedRatio={webpageImgIsFixedRatio}
        />
      )}
    </View>
  );
}
