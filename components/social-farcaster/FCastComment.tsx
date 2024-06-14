import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import FCastEmbeds from "./FCastEmbeds";
import FCastCommentActions from "./FCastCommentActions";
import { CommunityInfo } from "~/services/community/types/community";
import { ConversationCast } from "~/services/farcaster/types/neynar";
import NeynarCastUserInfo from "./NeynarCastUserInfo";
import NeynarCastText from "./NeynarCastText";

export default function FCastComment({
  cast,
  communityInfo,
  className,
  ...props
}: ViewProps & {
  cast: ConversationCast;
  communityInfo: CommunityInfo;
}) {
  return (
    <View className={cn("flex w-full flex-col gap-3", className)} {...props}>
      {/* header - user info */}
      <View className="flex flex-row items-center justify-between gap-6">
        <NeynarCastUserInfo userData={cast.author} />
      </View>
      {/* body - text & embed */}
      <NeynarCastText cast={cast} />
      <FCastEmbeds className="gap-3" cast={cast} />
      <FCastCommentActions
        className=" ml-auto"
        cast={cast}
        communityInfo={communityInfo}
      />
    </View>
  );
}
