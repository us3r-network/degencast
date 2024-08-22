import { View } from "react-native";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { CommunityToken } from "~/components/portfolio/tokens/UserCommunityTokens";
import DegenTipsStats from "~/components/portfolio/user/DegenTipsStats";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Channel } from "~/services/farcaster/types";

export default function UserChannelAssets({
  channel,
  className,
}: {
  channel: Channel;
  className?: string;
}) {
  const userAssetsValue =
    Number(channel.tokenInfo?.tradeInfo?.stats?.token_price_usd || 0) *
    Number(channel.tokenInfo?.balance || 0);

  if (userAssetsValue === 0) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <View className={cn("rounded-full bg-secondary px-2", className)}>
          <Text className="text-xs text-white">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            }).format(userAssetsValue)}
          </Text>
        </View>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader className={cn("flex gap-2")}>
          <DialogTitle>Channel Assets</DialogTitle>
        </DialogHeader>
        <View className="flex gap-6">
          <View className="flex-row items-center justify-between gap-4">
            <CommunityInfo name={channel.name} logo={channel.image_url} />
            <Text>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
              }).format(userAssetsValue)}
            </Text>
          </View>
          <Separator className="bg-secondary/10" />
          {channel.tokenInfo && (
            <CommunityToken token={channel.tokenInfo} withSwapButton />
          )}
          {/* {channel.attentionTokenAddress && (
            todo: add ATT token info
          )} */}
          <MyPoints />
        </View>
      </DialogContent>
    </Dialog>
  );
}

function MyPoints() {
  return (
    <View className="flex gap-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text>Allowance</Text>
        <DegenTipsStats />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Points</Text>
        <Text>-</Text>
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text>Rewards</Text>
        <View className="flex-row items-center gap-2">
          <Text>-</Text>
          <Button
            size="sm"
            disabled
            variant="outline"
            onPress={() => {
              // console.log("Claim button pressed");
            }}
          >
            <Text>Claim</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
