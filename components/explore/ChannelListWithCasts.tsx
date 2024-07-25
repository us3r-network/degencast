import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../common/Loading";
import type { SelectionFeedsItem } from "~/hooks/explore/useLoadSelectionFeeds";
import ChannelCard from "./channel-card/ChannelCard";

export default function ChannelListWithCasts({
  items,
  loading,
  onEndReached,
}: {
  items: SelectionFeedsItem[];
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
