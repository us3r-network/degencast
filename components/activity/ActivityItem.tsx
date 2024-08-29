import dayjs from "dayjs";
import { Link } from "expo-router";
import { Pressable, View, ViewProps } from "react-native";
import { formatUnits } from "viem";
import { cn } from "~/lib/utils";
import { WarpcastChannel } from "~/services/community/api/community";
import {
  ActivityEntity,
  ActivityOperation,
} from "~/services/community/types/activity";
import { Author, NeynarCast } from "~/services/farcaster/types/neynar";
import { shortAddress } from "~/utils/shortAddress";
import { CommunityInfo } from "../common/CommunityInfo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";
import { FCastWithNftImage } from "../social-farcaster/proposal/FCast";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import { useState } from "react";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export default function ActivityItem({ data }: { data: ActivityEntity }) {
  if (!data) return;
  // mint and burn payment token amount is token price
  const totalPayment =
    data.operation === ActivityOperation.MINT ||
    data.operation === ActivityOperation.BURN
      ? BigInt(data.paymentTokenAmount) * BigInt(data.tokenAmount)
      : BigInt(data.paymentTokenAmount);
  const paymentAmount = formatUnits(
    totalPayment,
    data.paymentTokenInfo?.decimals,
  );
  const paymentText = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(Number(paymentAmount));
  return (
    <Card className="rounded-2xl bg-white p-2 sm:p-6">
      <CardContent className="flex gap-2 p-0">
        <View className="w-full flex-row justify-between">
          <View className="flex-row items-center gap-2">
            <ActivityItemUser
              userAddr={data.userAddr}
              userData={data.user}
              hideHandle
            />
            <ActivityItemOperation operation={data.operation} />
          </View>
          {data.timestamp && (
            <Text className="whitespace-nowrap text-xs text-[#9BA1AD]">
              {dayjs(data.timestamp).fromNow(true)}
            </Text>
          )}
        </View>

        {data.operation === ActivityOperation.REWARD ? (
          <View className="w-full flex-row items-center gap-2">
            {data.channel && (
              <>
                <Link href={`/casts/${data?.cast?.hash}`}>
                  <Text className="text-primary underline">cast</Text>
                </Link>
                <Text>{`${data.rewardDescription}`}</Text>
                <ActivityItemChannel channel={data.channel} />
              </>
            )}
          </View>
        ) : (
          <View className="w-full flex-row items-center gap-2">
            {data.tokenAmount > 0 && (
              <Text className=" inline-block  align-baseline">
                {data.tokenAmount}
              </Text>
            )}
            {data.channel && (
              <>
                <Link href={`/casts/${data?.cast?.hash}`}>
                  <Text className="text-primary underline">cast</Text>
                </Link>
                <Text>in</Text>
                <ActivityItemChannel channel={data.channel} />
              </>
            )}
          </View>
        )}
        <View className="flex-row items-center gap-2">
          <Text>From</Text>
          <ActivityItemUser userData={data?.cast?.author} hideHandle />
          {data.paymentTokenAmount && data.paymentTokenInfo && (
            <Text>{`for ${paymentText} ${data.paymentTokenInfo.symbol}`}</Text>
          )}
        </View>
        {data?.cast && <ActivityCast cast={data?.cast} />}
      </CardContent>
    </Card>
  );
}

function ActivityItemUser({
  userAddr,
  userData,
  className,
  hideHandle = false,
  ...props
}: ViewProps & {
  userAddr?: string;
  userData: Author;
  hideHandle?: boolean;
}) {
  return (
    <Link
      href={`/u/${userData?.fid}`}
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
            <Text className="line-clamp-1 text-sm hover:underline">
              {userData?.display_name}
            </Text>
            {/* {userData.power_badge && (
              <Image
                source={require("~/assets/images/active-badge.webp")}
                style={{ width: 12, height: 12 }}
              />
            )} */}
            {!hideHandle && (
              <Text className="text-xs text-[#9BA1AD] hover:underline">
                @{userData?.username}
              </Text>
            )}
          </>
        ) : (
          <Text className="line-clamp-1 text-xs text-[#9BA1AD] hover:underline">
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
        operation === ActivityOperation.BURN ||
          operation === ActivityOperation.BUY ||
          operation === ActivityOperation.REWARD ||
          operation === ActivityOperation.DISPUTE
          ? "text-[#F41F4C]"
          : operation === ActivityOperation.MINT ||
              operation === ActivityOperation.SELL ||
              operation === ActivityOperation.PROPOSE
            ? "text-[#00D1A7]"
            : "",
      )}
    >
      {operation === ActivityOperation.PROPOSE
        ? "upvoted"
        : operation === ActivityOperation.DISPUTE
          ? "downvoted"
          : operation === ActivityOperation.MINT
            ? "minted"
            : operation === ActivityOperation.BURN
              ? "burned"
              : operation === ActivityOperation.REWARD
                ? "rewarded"
                : operation}
    </Text>
  );
}

export function ActivityItemChannel({ channel }: { channel: WarpcastChannel }) {
  return (
    <Link asChild href={`/communities/${channel.id || ""}`}>
      <Pressable
        className="flex-row items-center gap-1 align-bottom"
        onPress={(e) => {
          e.stopPropagation();
          if (!channel.id) {
            e.preventDefault();
          }
        }}
      >
        <CommunityInfo name={channel.name} logo={channel.imageUrl} />
      </Pressable>
    </Link>
  );
}

function ActivityCast({ cast }: { cast: NeynarCast }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-[-30px]">
      <CollapsibleTrigger>
        <View className="absolute right-0 top-[72px]">
          {open ? <ChevronUp /> : <ChevronDown />}
        </View>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FCastWithNftImage
          className="mb-[-24px] mt-4 overflow-hidden"
          cast={cast}
          hideUserInfo
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
