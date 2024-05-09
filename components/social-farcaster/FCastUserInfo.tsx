import { View, ViewProps } from "react-native";
import { UserData } from "~/utils/farcaster/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

export default function FCastUserInfo({
  userData,
  className,
  ...props
}: ViewProps & {
  userData: UserData;
}) {
  return (
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
      <Text className="font-interMedium line-clamp-1 text-base">
        {userData?.display}
      </Text>
      <Text className="text-sm text-[#A36EFE]">@{userData?.userName}</Text>
    </View>
  );
}
