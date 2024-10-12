import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../../common/Loading";
import { CastFeedsItem } from "~/hooks/explore/useLoadCastFeeds";
import ChannelCastCard from "~/components/social-farcaster/proposal/channel-card/ChannelCastCard";
import { cn } from "~/lib/utils";

export default function CastListWithChannel({
  items,
  loading,
  onEndReached,
  renderHeaderComponent,
}: {
  items: CastFeedsItem[];
  loading: boolean;
  onEndReached: () => void;
  renderHeaderComponent?: () => React.ReactNode;
}) {
  return (
    <FlatList
      style={{
        flex: 1,
      }}
      showsHorizontalScrollIndicator={false}
      data={items}
      keyExtractor={(item, index) => `${item.cast.hash}-${index}`}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ItemSeparatorComponent={() => <View className="h-4" />}
      renderItem={({ item }) => {
        const { channel, cast, proposal, tokenInfo } = item;
        return (
          <ChannelCastCard
            channel={channel}
            tokenInfo={tokenInfo}
            cast={cast}
            proposal={proposal}
          />
        );
      }}
      ListHeaderComponent={() => {
        if (renderHeaderComponent) {
          return renderHeaderComponent();
        }
        return null;
      }}
      ListFooterComponent={() => {
        if (loading) {
          return (
            <>
              <View
                className={cn(
                  "ios:pb-0 mb-5 flex flex-row items-center justify-center",
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
