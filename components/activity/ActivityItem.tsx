import dayjs from "dayjs";
import { Link } from "expo-router";
import { Pressable, View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import {
  ActivityEntity,
  ActivityOperation,
} from "~/services/community/types/activity";
import { Author } from "~/services/farcaster/types/neynar";
import { shortAddress } from "~/utils/shortAddress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";
import { Card, CardContent } from "../ui/card";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export default function ActivityItem({ data }: { data: ActivityEntity }) {
  return (
    <Card className="rounded-2xl bg-white p-2 sm:p-6">
      <CardContent className="flex gap-2 p-0">
        <View className="w-full flex-row justify-between">
          <ActivityItemUser userAddr={data?.userAddr} userData={data.user} />
          {data?.timestamp && (
            <Text className="whitespace-nowrap">
              {dayjs(data.timestamp).fromNow(true)}
            </Text>
          )}
        </View>
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
            {data?.badgeAmount}
          </Text>{" "}
          <Link asChild href={`/communities/${data?.channel?.id || ""}`}>
            <Pressable
              className="flex-row items-center align-bottom"
              onPress={(e) => {
                e.stopPropagation();
                if (!data?.channel?.id) {
                  e.preventDefault();
                }
              }}
            >
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
          <Text> with {data?.degenAmount?.toLocaleString()} Degen</Text>
        </Text>
      </CardContent>
    </Card>
  );
}

export function ActivityItemUser({
  userAddr,
  userData,
  className,
  ...props
}: ViewProps & {
  userAddr?: string;
  userData: Author;
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
            <Text className=" text-base font-medium text-secondary hover:underline">
              @{userData?.username}
            </Text>
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
      <Pressable
        className="flex-row items-center gap-1 align-bottom"
        onPress={(e) => {
          e.stopPropagation();
          if (!data?.channel?.id) {
            e.preventDefault();
          }
        }}
      >
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
