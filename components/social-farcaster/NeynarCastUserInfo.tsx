import { View, ViewProps, Image } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Link } from "expo-router";
import { Author } from "~/services/farcaster/types/neynar";
import dayjs from "dayjs";

export default function NeynarCastUserInfo({
  userData,
  timestamp,
  className,
  ...props
}: ViewProps & {
  userData: Author;
  timestamp?: string;
}) {
  return (
    <Link
      href={`/u/${userData.fid}`}
      onPress={(e) => {
        e.stopPropagation();
      }}
    >
      <View
        className={cn("flex flex-1 flex-row items-center gap-1", className)}
        {...props}
      >
        <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full object-cover">
          <AvatarImage source={{ uri: userData?.pfp_url }} />
          <AvatarFallback>
            <Text>{userData?.display_name?.slice(0, 1)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="line-clamp-1 font-bold text-foreground hover:underline">
          {userData?.display_name}
        </Text>
        {userData.power_badge && (
          <Image
            source={require("~/assets/images/active-badge.webp")}
            style={{ width: 12, height: 12 }}
          />
        )}
        <Text className=" text-secondary hover:underline">
          @{userData?.username}
        </Text>
        {timestamp && (
          <Text className="text-nowrap text-secondary">
            · {dayjs(timestamp).fromNow(true)}
          </Text>
        )}
      </View>
    </Link>
  );
}
