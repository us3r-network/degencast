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
import { TokenInfo } from "../common/TokenInfo";
import { formatUnits } from "viem";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export default function ActivityItem({ data }: { data: ActivityEntity }) {
  if (!data) return;
  const paymentAmount = formatUnits(
    BigInt(data.paymentTokenAmount),
    data.paymentTokenInfo?.decimals,
  );
  const paymentText = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(Number(paymentAmount));
  return (
    <Card className="rounded-2xl bg-white p-2 sm:p-6">
      <CardContent className="flex gap-2 p-0">
        <View className="w-full flex-row justify-between">
          <ActivityItemUser userAddr={data.userAddr} userData={data.user} />
          {data.timestamp && (
            <Text className="whitespace-nowrap">
              {dayjs(data.timestamp).fromNow(true)}
            </Text>
          )}
        </View>
        <View className="w-full flex-row items-center gap-2">
          <ActivityItemOperation operation={data.operation} />
          <Text className=" inline-block  align-baseline">
            {data.tokenAmount}
          </Text>
          <ActivityItemToken data={data} />
          {data.paymentTokenAmount && data.paymentTokenInfo && (
            <Text>
              {`cast with ${paymentText} ${data.paymentTokenInfo.symbol}`}
            </Text>
          )}
        </View>
      </CardContent>
    </Card>
  );
}

function ActivityItemUser({
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

export function ActivityItemOperation({
  operation,
}: {
  operation: ActivityOperation;
}) {
  return (
    <Text
      className={cn(
        " inline-block align-baseline text-base font-medium",
        operation === ActivityOperation.MINT ||
          operation === ActivityOperation.BUY ||
          operation === ActivityOperation.PROPOSE
          ? "text-[#F41F4C]"
          : operation === ActivityOperation.BURN ||
              operation === ActivityOperation.SELL ||
              operation === ActivityOperation.DISPUTE
            ? "text-[#00D1A7]"
            : "",
      )}
    >
      {capitalize(operation || "")}
    </Text>
  );
}

export function ActivityItemToken({ data }: { data: ActivityEntity }) {
  return (
    <Link asChild href={`/communities/${data.channel?.id || ""}`}>
      <Pressable
        className="flex-row items-center gap-1 align-bottom"
        onPress={(e) => {
          e.stopPropagation();
          if (!data.channel?.id) {
            e.preventDefault();
          }
        }}
      >
        <TokenInfo
          name={data.tokenInfo.name || data.channel.name}
          logo={data.tokenInfo.logo || data.channel.logo}
        />
      </Pressable>
    </Link>
  );
}
