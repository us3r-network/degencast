import { View, ViewProps } from "react-native";
import { FarCast } from "~/services/farcaster/types";
import { UserData } from "~/utils/farcaster/user-data";
import FCastText from "./FCastText";
import { cn } from "~/lib/utils";
import FCastUserInfo from "./FCastUserInfo";
import FCastEmbeds from "./FCastEmbeds";
import FCastCommentActions from "./FCastCommentActions";

export default function FCastComment({
  cast,
  farcasterUserDataObj,
  className,
  ...props
}: ViewProps & {
  cast: FarCast;
  farcasterUserDataObj?: { [key: string]: UserData } | undefined;
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
      </View>
      {/* body - text & embed */}
      <FCastText cast={cast} farcasterUserDataObj={farcasterUserDataObj} />
      <FCastEmbeds cast={cast} />
      <FCastCommentActions className=" ml-auto" cast={cast} />
    </View>
  );
}
