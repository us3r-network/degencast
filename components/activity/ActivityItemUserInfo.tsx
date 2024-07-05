import { Pressable, View, ViewProps } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Link, useRouter } from "expo-router";
import { Author } from "~/services/farcaster/types/neynar";
import dayjs from "dayjs";
import { shortAddress } from "~/utils/shortAddress";

export default function ActivityItemUserInfo({
  userAddr,
  userData,
  timestamp,
  className,
  ...props
}: ViewProps & {
  userAddr?: string;
  userData: Author;
  timestamp?: string | number;
}) {
  const router = useRouter();
  return (
    <Link
      href={`/u/${userData.fid}`}
      onPress={(e) => {
        e.stopPropagation();
      }}
    >
      <View
        className={cn("flex w-full flex-row items-center gap-1 ", className)}
        {...props}
      >
        {userData?.username ? (
          <>
            <Avatar
              alt={"Avatar"}
              className="h-5 w-5 rounded-full object-cover"
            >
              <AvatarImage source={{ uri: userData?.pfp_url }} />
              <AvatarFallback>
                <Text>{userData?.display_name?.slice(0, 1)}</Text>
              </AvatarFallback>
            </Avatar>
            <Text className="line-clamp-1 text-base font-bold hover:underline">
              {userData?.display_name}
            </Text>
            <Text className=" text-base font-medium text-secondary hover:underline">
              @{userData?.username}
            </Text>
          </>
        ) : (
          <Text className="line-clamp-1 text-base font-bold hover:underline">
            {userAddr ? shortAddress(userAddr) : "undefined"}
          </Text>
        )}

        {timestamp && (
          <Text className=" whitespace-nowrap text-base font-medium text-secondary">
            · {dayjs(timestamp).fromNow(true)}
          </Text>
        )}
      </View>
    </Link>
  );
}
