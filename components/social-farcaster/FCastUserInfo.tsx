import { Pressable, View, ViewProps } from "react-native";
import { UserData } from "~/utils/farcaster/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Link, useRouter } from "expo-router";

export default function FCastUserInfo({
  userData,
  className,
  ...props
}: ViewProps & {
  userData: UserData;
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
          <AvatarImage source={{ uri: userData?.pfp }} />
          <AvatarFallback>
            <Text>{userData?.display.slice(0, 1)}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="line-clamp-1 text-sm font-normal">
          {userData?.display}
        </Text>
        <Text className=" text-xs font-normal text-secondary">
          @{userData?.userName}
        </Text>
      </View>
    </Pressable>
  );
}
