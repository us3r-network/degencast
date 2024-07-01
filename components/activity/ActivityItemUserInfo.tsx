import { Pressable, View, ViewProps } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Link, useRouter } from "expo-router";
import { Author } from "~/services/farcaster/types/neynar";
import dayjs from "dayjs";

export default function ActivityItemUserInfo({
  userData,
  timestamp,
  className,
  ...props
}: ViewProps & {
  userData: Author;
  timestamp?: string | number;
}) {
  const router = useRouter();
  return (
    <Link asChild href={`/u/${userData.fid}/tokens`}>
      <Pressable
        className="w-full"
        onPress={(e) => {
          e.preventDefault();
          router.push(`/u/${userData.fid}/tokens`);
        }}
      >
        <View
          className={cn("flex w-full flex-row items-center gap-1 ", className)}
          {...props}
        >
          <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full object-cover">
            <AvatarImage source={{ uri: userData?.pfp_url }} />
            <AvatarFallback>
              <Text>{userData?.display_name?.slice(0, 1)}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="line-clamp-1 text-base font-bold">
            {userData?.display_name}
          </Text>
          <Text className=" text-base font-medium text-secondary">
            @{userData?.username}
          </Text>
          {timestamp && (
            <Text className=" whitespace-nowrap text-base font-medium text-secondary">
              · {dayjs(timestamp).fromNow(true)}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
