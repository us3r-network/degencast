import {
  ActivityEntity,
  ActivityOperation,
} from "~/services/community/types/activity";
import { Text } from "../ui/text";
import ActivityItemUserInfo from "./ActivityItemUserInfo";
import { Pressable, View, ViewProps, Image } from "react-native";
import { Link } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";
import { Author } from "~/services/farcaster/types/neynar";
import { shortAddress } from "~/utils/shortAddress";
import dayjs from "dayjs";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export default function ActivityItem({ data }: { data: ActivityEntity }) {
  return (
    <View className="flex w-full flex-col gap-4">
      <ActivityItemUserInfo
        userAddr={data?.userAddr}
        userData={data.user}
        timestamp={data.timestamp}
      />
      <Text
        className={cn(
          " inline-block align-baseline text-base font-medium",
          data?.operation === ActivityOperation.buy
            ? "text-[#F41F4C]"
            : data?.operation === ActivityOperation.sell
              ? "text-[#00D1A7]"
              : "",
        )}
      >
        {capitalize(data?.operation || "")}{" "}
        <Text className=" inline-block  align-baseline">
          {data?.badgeAmount} Channel Badge of
        </Text>{" "}
        <Link asChild href={`/communities/${data?.channel?.id || ""}`}>
          <Pressable className="flex-row items-center align-bottom">
            <Avatar
              alt={"Avatar"}
              className="h-5 w-5 rounded-full object-cover  "
            >
              <AvatarImage source={{ uri: data?.channel?.imageUrl }} />
              <AvatarFallback>
                <Text>{data?.channel?.id || ""}</Text>
              </AvatarFallback>
            </Avatar>
            {data?.channel?.id && (
              <Text className=" text-base font-medium  text-secondary hover:underline">
                /{data?.channel?.id}
              </Text>
            )}
          </Pressable>
        </Link>
      </Text>
      <Text>{data?.degenAmount?.toLocaleString()} Degen</Text>
    </View>
  );
}

export function ActivityItemUser({
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
  return (
    <Link
      href={`/u/${userData.fid}`}
      onPress={(e) => {
        e.stopPropagation();
        if (!userData.fid) {
          e.preventDefault();
        }
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
            <Text className="line-clamp-1 hover:underline">
              {userData?.display_name}
            </Text>
            {/* {userData.power_badge && (
              <Image
                source={require("~/assets/images/active-badge.webp")}
                style={{ width: 12, height: 12 }}
              />
            )} */}
            {/* <Text className=" text-base font-medium text-secondary hover:underline">
              @{userData?.username}
            </Text> */}
          </>
        ) : (
          <Text className="line-clamp-1 hover:underline">
            {userAddr ? shortAddress(userAddr) : "undefined"}
          </Text>
        )}
      </View>
    </Link>
  );
}

export function ActivityItemOperation({ data }: { data: ActivityEntity }) {
  return (
    <Text
      className={cn(
        " inline-block align-baseline",
        data?.operation === ActivityOperation.buy
          ? "text-[#F41F4C]"
          : data?.operation === ActivityOperation.sell
            ? "text-[#00D1A7]"
            : "",
      )}
    >
      {capitalize(data?.operation || "")} {data?.badgeAmount}
    </Text>
  );
}

export function ActivityItemChannel({ data }: { data: ActivityEntity }) {
  return (
    <Link asChild href={`/communities/${data?.channel?.id || ""}`}>
      <Pressable className="flex-row items-center gap-1 align-bottom">
        <Avatar alt={"Avatar"} className="h-5 w-5 rounded-full object-cover  ">
          <AvatarImage source={{ uri: data?.channel?.imageUrl }} />
          <AvatarFallback>
            <Text>{data?.channel?.id || ""}</Text>
          </AvatarFallback>
        </Avatar>
        {data?.channel?.id && (
          <Text className="line-clamp-1 hover:underline">
            /{data?.channel?.id}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}

export function ActivityItemDegenAmount({ data }: { data: ActivityEntity }) {
  return <Text>{data?.degenAmount?.toLocaleString()}</Text>;
}
