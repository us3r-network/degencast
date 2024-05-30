import { Link } from "expo-router";
import { FlatList, Image, View } from "react-native";
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
import { cn } from "~/lib/utils";
import { Channel } from "~/services/farcaster/types/neynar";

export default function ChannelList({ fid }: { fid: number }) {
  const { loading, items, hasNext, loadMore } = useUserChannels(fid);
  // console.log("ChannelList", { fid, loading, items, hasNext });
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
              columnWrapperStyle={{
                gap: 12,
                flex: 1,
                justifyContent: "space-between",
              }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <View className="w-full max-w-[31%]">
                  <ChannelThumb key={item.id} channel={item} fid={fid} />
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
}

function ChannelThumb({ channel, fid }: { channel: Channel; fid?: number }) {
  const isHost = channel.hosts?.some((host) => host.fid === fid);
  const hasToken = Number(channel.tokenInfo?.balance || 0) > 0;
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
        {hasToken && <ChannelAssets channel={channel} />}
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
            <MyCommunityToken token={channel.tokenInfo} withSwapButton />
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
