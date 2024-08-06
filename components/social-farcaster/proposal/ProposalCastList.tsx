import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../../common/Loading";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import FCast from "./FCast";
import CastStatusActions from "./CastStatusActions";
import { CardWrapper } from "./ProposalStyled";
import { FCastExploreActions } from "../FCastActions";

export default function ProposalCastList({
  channel,
  tokenInfo,
  items,
  loading,
  onEndReached,
}: {
  channel: CommunityEntity;
  showChannel?: boolean;
  tokenInfo: AttentionTokenEntity;
  items: Array<{
    cast: NeynarCast;
    proposal: ProposalEntity;
  }>;
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
        const { cast, proposal } = item;
        return (
          <CardWrapper className="w-full flex-col gap-4 px-4">
            <FCast cast={cast} channel={channel} />
            <View className="flex flex-row items-center justify-between">
              <CastStatusActions
                cast={cast}
                channel={channel}
                tokenInfo={tokenInfo}
                proposal={proposal}
              />
              <View className="ml-auto">
                <FCastExploreActions
                  cast={cast}
                  communityInfo={channel as any}
                />
              </View>
            </View>
          </CardWrapper>
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
