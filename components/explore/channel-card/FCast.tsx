import { Pressable, View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import NeynarCastUserInfo from "~/components/social-farcaster/NeynarCastUserInfo";
import NeynarCastText from "~/components/social-farcaster/NeynarCastText";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { useRouter } from "expo-router";
import useCastPage from "~/hooks/social-farcaster/useCastPage";

export default function FCast({
  cast,
  className,
  readOnly,
}: ViewProps & {
  cast: NeynarCast;
  readOnly?: boolean;
}) {
  const castHex = getCastHex(cast);
  const router = useRouter();
  const { setCastDetailCacheData } = useCastPage();
  return (
    <View className={cn("w-full", className)}>
      <Pressable
        className="flex w-full flex-col gap-4 overflow-hidden"
        onPress={(e) => {
          e.stopPropagation();
          if (readOnly) return;
          setCastDetailCacheData(castHex, {
            cast: cast,
          });
          router.push(`/casts/${castHex}`);
        }}
      >
        {/* header - user info */}
        <View className="flex flex-row items-center justify-between gap-6">
          <NeynarCastUserInfo
            userData={cast.author}
            timestamp={cast.timestamp}
          />
        </View>
        {/* body - text & embed */}
        <NeynarCastText cast={cast} />
      </Pressable>
    </View>
  );
}
