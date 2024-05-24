import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import FCastText from "./FCastText";
import UserGlobalPoints from "../point/UserGlobalPoints";
import { cn } from "~/lib/utils";
import FCastUserInfo from "./FCastUserInfo";
import FCastEmbeds from "./FCastEmbeds";

export default function FCast({
  cast,
  farcasterUserDataObj,
  className,
  hidePoints = true,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
  hidePoints?: boolean;
}) {
  const userData = farcasterUserDataObj?.[cast.fid];
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
      <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
      <FCastEmbeds cast={cast} />
    </View>
  );
}
