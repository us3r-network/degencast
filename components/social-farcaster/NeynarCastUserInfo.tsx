import { Pressable, View, ViewProps } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { useRouter } from "expo-router";
import { Author } from "~/services/farcaster/types/neynar";

export default function NeynarCastUserInfo({
  userData,
  className,
  ...props
}: ViewProps & {
  userData: Author;
}) {
  const router = useRouter();
  return (
    <Pressable
      className="flex-1"
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
            <Text>{userData?.display_name.slice(0, 1)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="line-clamp-1 text-sm font-normal">
          {userData?.display_name}
        </Text>
        <Text className=" text-xs font-normal text-secondary">
          @{userData?.username}
        </Text>
      </View>
    </Pressable>
  );
}
