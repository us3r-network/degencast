import { usePrivy } from "@privy-io/react-auth";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, View, Image } from "react-native";
import { Loading } from "~/components/common/Loading";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useUserChannels from "~/hooks/user/useUserChannels";
import { Channel } from "~/services/farcaster/types/neynar";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function ChannelsScreen() {
  const params = useLocalSearchParams();
  const { ready, authenticated, user, linkFarcaster } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = params.fid || farcasterAccount?.fid;
  const { loading, items, load, hasNext } = useUserChannels();
  useEffect(() => {
    if (fid) load(Number(fid));
  }, [fid]);
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
                columnWrapperStyle={{ gap: 10 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) => <ChannelThumb channel={item} />}
                keyExtractor={(item) => item.id}
                onEndReached={() => {
                  if (loading || !hasNext) return;
                  load(Number(fid));
                }}
                onEndReachedThreshold={1}
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

function ChannelThumb({ channel }: { channel: Channel }) {
  return (
    <Pressable
      className="flex-1"
      onPress={() => {
        console.log("show channels assets");
      }}
    >
      <View className="w-full">
        <AspectRatio ratio={1}>
          <Image
            source={{ uri: channel.image_url }}
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
        <Text className="line-clamp-1">{channel.name}</Text>
      </View>
    </Pressable>
  );
}
