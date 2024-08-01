import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../../common/Loading";
import { CastFeedsItem } from "~/hooks/explore/useLoadCastFeeds";
import ChannelCastCard from "~/components/social-farcaster/proposal/channel-card/ChannelCastCard";

export default function CastListWithChannel({
  items,
  loading,
  onEndReached,
}: {
  items: CastFeedsItem[];
  loading: boolean;
  onEndReached: () => void;
}) {
  return (
    <FlatList
      style={{
        flex: 1,
      }}
      showsHorizontalScrollIndicator={false}
      data={items}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={() => <View className="h-4" />}
      renderItem={({ item, index }) => {
        const { channel, cast, proposal, tokenInfo } = item;
        return (
          <ChannelCastCard
            key={index.toString()}
            channel={channel}
            tokenInfo={tokenInfo}
            cast={cast}
            proposal={proposal}
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
