import {
  ActivityEntity,
  ActivityOperation,
} from "~/services/community/types/activity";
import { Text } from "../ui/text";
import ActivityItemUserInfo from "./ActivityItemUserInfo";
import { Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "~/lib/utils";

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
        <Link asChild href={`communities/${data?.channel?.id || ""}`}>
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
              <Text className=" text-base font-medium  text-secondary">
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
