import { useEffect } from "react";
import useLoadCastFeeds from "~/hooks/explore/useLoadCastFeeds";
import { FlatList, View } from "react-native";
import ChannelCard from "./channel-card/ChannelCard";
import { Loading } from "../common/Loading";
import { Text } from "~/components/ui/text";

export default function CastFeeds() {
  const { loadItems, loading, items } = useLoadCastFeeds();
  useEffect(() => {
    loadItems();
  }, []);
  const showItems = items.map((item) => ({
    channel: item.channel,
    casts: item?.cast ? [{ cast: item.cast, proposal: item.proposal }] : [],
    tokenInfo: item.tokenInfo,
  }));

  return (
    <FlatList
      style={{
        flex: 1,
      }}
      showsHorizontalScrollIndicator={false}
      data={showItems}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
      onEndReachedThreshold={0.2}
      ItemSeparatorComponent={() => <View className="h-4" />}
      renderItem={({ item, index }) => {
        const { channel, casts, tokenInfo } = item;
        return (
          <ChannelCard
            key={index.toString()}
            channel={channel}
            tokenInfo={tokenInfo}
            casts={casts}
          />
        );
      }}
      ListFooterComponent={() => {
        if (loading) {
          return (
            <>
              <View className="ios:pb-0 items-center py-3">
                <Text
                  nativeID="invoice-table"
                  className="items-center text-sm text-muted-foreground"
                >
                  <Loading />
                </Text>
              </View>
            </>
          );
        }
      }}
    />
  );
}
