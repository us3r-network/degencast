import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import FCastText from "./FCastText";
import UserGlobalPoints from "../point/UserGlobalPoints";
import { cn } from "~/lib/utils";
import FCastUserInfo from "./FCastUserInfo";
import FCastEmbeds from "./FCastEmbeds";
import { getEmbeds } from "~/utils/farcaster/getEmbeds";
import { useMemo } from "react";

export default function FCast({
  cast,
  farcasterUserDataObj,
  className,
  hidePoints = true,
  webpageImgIsFixedRatio,
  viewMoreWordLimits,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  hidePoints?: boolean;
  webpageImgIsFixedRatio?: boolean;
  viewMoreWordLimits?: number;
}) {
  const userData = farcasterUserDataObj?.[cast.fid];
  const embeds = useMemo(() => getEmbeds(cast), [cast]);
  const hasEmbeds =
    embeds.imgs.length > 0 ||
    embeds.casts.length > 0 ||
    embeds.videos.length > 0 ||
    embeds.webpages.length > 0;
  return (
    <View
      key={cast.id}
      className={cn("flex w-full flex-col gap-5", className)}
      {...props}
    >
      {/* header - user info */}
      <View className="flex flex-row items-center justify-between gap-6">
        <FCastUserInfo userData={userData!} />
        {!hidePoints && <UserGlobalPoints />}
      </View>
      {/* body - text & embed */}
      <FCastText
        cast={cast}
        farcasterUserDataObj={farcasterUserDataObj}
        viewMoreWordLimits={hasEmbeds ? viewMoreWordLimits : undefined}
      />
      <FCastEmbeds
        cast={cast}
        webpageImgIsFixedRatio={webpageImgIsFixedRatio}
      />
    </View>
  );
}
