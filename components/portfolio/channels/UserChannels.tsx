import { Link } from "expo-router";
import { FlatList, Image, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import {
  useUserChannels,
  useUserFollowingChannels,
} from "~/hooks/user/useUserChannels";
import { Channel } from "~/services/farcaster/types";
import UserChannelAssets from "./UserChannelAssets";

export function UserFollowingChannels({ fid }: { fid: number }) {
  const { loading, items, hasMore, load } = useUserFollowingChannels(fid);
  // console.log("UserFollowingChannels", { items, hasMore });
  return (
    <ChannelList
      items={items}
      loading={loading}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0) || !hasMore) return;
        load();
      }}
    />
  );
}

export function UserChannels({ fid }: { fid: number }) {
  const { loading, items } = useUserChannels(fid);
  // console.log("UserChannels", { items });
  return <ChannelList items={items} loading={loading} />;
}

function ChannelList({
  loading,
  items,
  onEndReached,
}: {
  items: Channel[];
  loading: boolean;
  onEndReached?: () => void;
}) {
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
                justifyContent:
                  items.length >= 3 ? "space-between" : "flex-start",
              }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <View className="w-full max-w-[31%]">
                  <ChannelThumb key={item.id} channel={item} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              onEndReached={onEndReached}
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
        {hasToken && <UserChannelAssets channel={channel} />}
        {/* {isHost && (
          <View className="rounded-full bg-secondary px-2">
            <Text className="text-xs text-white">host</Text>
          </View>
        )} */}
      </View>
    </View>
  );
}
