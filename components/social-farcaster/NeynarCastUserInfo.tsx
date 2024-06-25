import { Pressable, View, ViewProps } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  return (
    <Pressable
      onPress={(e) => {
        e.preventDefault();
        router.push(`/u/${userData.fid}/tokens`);
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
        <Text className="line-clamp-1 text-sm font-normal">
          {userData?.display_name}
        </Text>
        <Text className=" text-xs font-normal text-secondary">
          @{userData?.username}
        </Text>
        {timestamp && (
          <Text className=" text-xs font-normal text-secondary">
            · {dayjs(timestamp).fromNow(true)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
