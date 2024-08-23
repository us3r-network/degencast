import { Link } from "expo-router";
import { FlatList, Image, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Text } from "~/components/ui/text";
import useUserChannels from "~/hooks/user/useUserChannels";
import { Channel } from "~/services/farcaster/types";
import UserChannelAssets from "./UserChannelAssets";
import { UserChannelsType } from "~/features/user/userChannelsSlice";
import { useEffect } from "react";

export default function ChannelList({
  fid,
  type,
}: {
  fid: number;
  type: UserChannelsType;
}) {
  const { loading, items, hasNext, loadMore } = useUserChannels(fid, type);
  // todo: when back from /user/channels/:id, the list is not updated
  useEffect(() => {
      loadMore();
  }, [fid, type]);
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
        {hasToken && <UserChannelAssets channel={channel} />}
        {isHost && (
          <View className="rounded-full bg-secondary px-2">
            <Text className="text-xs text-white">host</Text>
          </View>
        )}
      </View>
    </View>
  );
}
