import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../common/Loading";
import type { SelectionFeedsItem } from "~/hooks/explore/useLoadSelectionFeeds";
import ChannelCollectCard from "./channel-card/ChannelCollectCard";
import { cn } from "~/lib/utils";

export default function ChannelListWithCollectCasts({
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
      keyExtractor={(item, index) => `${item.channel.id}-${index}`}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={() => <View className="h-4" />}
      renderItem={({ item }) => {
        const { channel, casts, tokenInfo } = item;
        return (
          <ChannelCollectCard
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
              <View
                className={cn(
                  "ios:pb-0 flex flex-row items-center justify-center py-3",
                  items.length === 0 ? "h-[70vh]" : "",
                )}
              >
                <Loading />
              </View>
            </>
          );
        }
      }}
    />
  );
}
