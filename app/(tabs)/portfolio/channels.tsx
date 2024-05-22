import { usePrivy } from "@privy-io/react-auth";
import { Link, useLocalSearchParams } from "expo-router";
import { FlatList, Image, View } from "react-native";
import { useAccount } from "wagmi";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Loading } from "~/components/common/Loading";
import { MyCommunityToken } from "~/components/portfolio/tokens/UserCommunityTokens";
import DegenTipsStats from "~/components/portfolio/user/DegenTipsStats";
import { AspectRatio } from "~/components/ui/aspect-ratio";
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
import useUserChannels from "~/hooks/user/useUserChannels";
import useUserCommunityTokens from "~/hooks/user/useUserCommunityTokens";
import { cn } from "~/lib/utils";
import { Channel } from "~/services/farcaster/types/neynar";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function ChannelsScreen() {
  const params = useLocalSearchParams();
  const { ready, authenticated, user, linkFarcaster } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = Number(params.fid || farcasterAccount?.fid || "0");
  const { address } = useAccount();
  const { loading, items, hasNext, loadMore } = useUserChannels(fid);

  if (fid) {
    return (
      <View className="container h-full">
        {loading && items.length === 0 ? (
          <Loading />
        ) : (
          <View className="flex-1">
            {items.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={items}
                numColumns={3}
                columnWrapperStyle={{ gap: 12, flex: 1, justifyContent: "space-between"}}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => (
                  <View className="w-full max-w-[32%]">
                    <ChannelThumb
                      key={item.id}
                      channel={item}
                      address={address}
                      fid={fid}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                onEndReached={() => {
                  if (loading || !hasNext) return;
                  loadMore();
                }}
                onEndReachedThreshold={2}
                ListFooterComponent={() => {
                  return loading ? <Loading /> : null;
                }}
              />
            )}
          </View>
        )}
      </View>
    );
  } else {
    if (ready && authenticated && !farcasterAccount) {
      return (
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            source={require("~/assets/images/no-fid.png")}
            className="h-72 w-72"
            style={{ width: 280, height: 280 }}
          />
          <Text className="text-lg font-bold text-primary">
            Login with Farcaster Only
          </Text>
          <Text className="text-md text-secondary">
            Please connect Farcaster to display & create your items
          </Text>
          <Button
            className="flex-row items-center justify-between gap-2"
            onPress={linkFarcaster}
          >
            <Image
              source={require("~/assets/images/farcaster.png")}
              style={{ width: 16, height: 16 }}
            />
            <Text>Link Farcaster</Text>
          </Button>
        </View>
      );
    }
  }
}

function ChannelThumb({
  channel,
  address,
  fid,
}: {
  channel: Channel;
  address?: `0x${string}`;
  fid?: number;
}) {
  const isHost = channel.hosts.some((host) => host.fid === fid);
  return (
    <View className="relative w-full">
      <Link href={`/communities/${channel.id}`} asChild>
        <View className="flex gap-1">
          <AspectRatio ratio={1}>
            <Image
              source={{ uri: channel.image_url }}
              className="h-full w-full rounded-lg object-cover"
            />
          </AspectRatio>
          <Text className="line-clamp-1">{channel.name}</Text>
        </View>
      </Link>
      <View className="absolute bottom-8 right-1">
        <ChannelAssets channel={channel} address={address} />
        {isHost && (
          <View className="rounded-full bg-secondary px-2">
            <Text className="text-xs text-white">host</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ChannelAssets({
  channel,
  address,
  className,
}: {
  channel: Channel;
  address?: `0x${string}`;
  className?: string;
}) {
  const { items: userTokens } = useUserCommunityTokens(address);
  const userChannelToken = userTokens.find(
    (item) => item.tradeInfo?.channel === channel.id,
  );
  const userAssetsValue =
    Number(userChannelToken?.tradeInfo?.stats?.token_price_usd || 0) *
    Number(userChannelToken?.balance || 0);

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
          {address && userChannelToken && (
            <MyCommunityToken token={userChannelToken} withSwapButton />
          )}
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
