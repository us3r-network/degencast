import dayjs from "dayjs";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View, ViewProps } from "react-native";
import { formatUnits } from "viem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ATT_CONTRACT_CHAIN } from "~/constants";
import { cn } from "~/lib/utils";
import { WarpcastChannel } from "~/services/community/api/community";
import {
  ActivityEntity,
  ActivityOperation,
} from "~/services/community/types/activity";
import { Author, NeynarCast } from "~/services/farcaster/types/neynar";
import { shortAddress } from "~/utils/shortAddress";
import { ExternalLink } from "../common/ExternalLink";
import { ChevronDown, ChevronUp } from "../common/Icons";
import { FCastWithNftImage } from "../social-farcaster/proposal/FCast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";

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
  const transcationUrl = data.txHash
    ? `${ATT_CONTRACT_CHAIN.blockExplorers?.default.url}/tx/${data.txHash}`
    : undefined;
  const eventLogUrl =
    data.blockNumber && data.logIndex
      ? `https://ethreceipts.org/l/${ATT_CONTRACT_CHAIN.id}/${data.blockNumber}/${data.logIndex}`
      : undefined;
  return (
    <Card className="rounded-2xl bg-white p-2 sm:p-6">
      <CardContent className="flex gap-2 p-0">
        {/* line 1 */}
        <View className="m-1 w-full flex-row justify-between">
          <ActivityItemUser
            userAddr={data.userAddr}
            userData={data.user}
            hideHandle
          />
          {data.timestamp ? (
            transcationUrl ? (
              <ExternalLink href={transcationUrl}>
                <Text className="whitespace-nowrap text-xs text-[#9BA1AD]">
                  {dayjs(data.timestamp).fromNow(true)}
                </Text>
              </ExternalLink>
            ) : (
              <Text className="whitespace-nowrap text-xs text-[#9BA1AD]">
                {dayjs(data.timestamp).fromNow(true)}
              </Text>
            )
          ) : null}
        </View>
        {/* line 2 */}
        <View className="m-1">
          <ActivityItemOperation
            operation={data.operation}
            payment={
              eventLogUrl ? (
                <ExternalLink href={eventLogUrl}>
                  <Text className="font-bold text-secondary underline">{`${paymentText} ${data.paymentTokenInfo.symbol}`}</Text>
                </ExternalLink>
              ) : (
                <Text>{`${paymentText} ${data.paymentTokenInfo.symbol}`}</Text>
              )
            }
            amount={data.tokenAmount}
            rewardDescription={data.rewardDescription}
          />
        </View>
        {/* line 3 */}
        <View className="w-1/2">
          <ActivityItemChannel channel={data.channel} />
        </View>
        {/* line 4 */}
        {data?.cast ? <ActivityCast cast={data?.cast} /> : null}
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
            {/* {userData.power_badge ? (
              <Image
                source={require("~/assets/images/active-badge.webp")}
                style={{ width: 12, height: 12 }}
              />
            ):null} */}
            {!hideHandle ? (
              <Text className="text-xs text-[#9BA1AD] hover:underline">
                @{userData?.username}
              </Text>
            ) : null}
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
  payment,
  amount,
  rewardDescription,
}: {
  operation: ActivityOperation;
  payment?: any;
  amount?: number;
  rewardDescription?: string;
}) {
  switch (operation) {
    case ActivityOperation.PROPOSE:
      return (
        <Text>
          stake {payment} to <Text className="text-[#00D1A7]">👍superlike</Text>
          .
        </Text>
      );
    case ActivityOperation.DISPUTE:
      return (
        <Text>
          stake {payment} to <Text className="text-[#F41F4C]">👎dislike</Text>.
        </Text>
      );
    case ActivityOperation.MINT:
      return (
        <Text>
          spent {payment} to <Text className="text-[#00D1A7]">mint</Text>{" "}
          {amount} NFT.
        </Text>
      );
    case ActivityOperation.BURN:
      return (
        <Text>
          <Text className="text-[#F41F4C]">burned</Text> {amount} and received{" "}
          {payment}.
        </Text>
      );
    case ActivityOperation.REWARD:
      switch (rewardDescription) {
        case "payout":
          return (
            <Text>
              received a <Text className="text-[#00D1A7]">payout</Text> of{" "}
              {payment}.
            </Text>
          );
        default:
          return (
            <Text>
              received {payment} as{" "}
              <Text className="text-[#00D1A7]">{rewardDescription}</Text>.
            </Text>
          );
      }
    default:
      return null;
  }
}

export function ActivityItemChannel({ channel }: { channel: WarpcastChannel }) {
  return (
    <Link asChild href={`/communities/${channel.id || ""}`}>
      <Pressable
        className="w-fit flex-row items-center gap-2 rounded-full border border-secondary p-1 pr-2"
        onPress={(e) => {
          e.stopPropagation();
          if (!channel.id) {
            e.preventDefault();
          }
        }}
      >
        <Avatar alt={channel.name || ""} className={cn("size-6")}>
          <AvatarImage source={{ uri: channel.imageUrl || "" }} />
          <AvatarFallback>
            <Text className="text-sm font-medium">
              {channel.name?.substring(0, 2)}
            </Text>
          </AvatarFallback>
        </Avatar>
        <Text className={cn("line-clamp-1 text-sm font-medium")}>
          /{channel.id}
        </Text>
      </Pressable>
    </Link>
  );
}

function ActivityCast({ cast }: { cast: NeynarCast }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      style={{ position: "relative", top: -36 }}
    >
      <CollapsibleTrigger style={{ position: "absolute", right: 0 }}>
        {open ? <ChevronUp color={"black"} /> : <ChevronDown color={"black"} />}
      </CollapsibleTrigger>
      <CollapsibleContent style={{ marginBottom: 0, top: 40 }}>
        <FCastWithNftImage cast={cast} />
      </CollapsibleContent>
    </Collapsible>
  );
}
