import * as React from "react";
import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Loading } from "../../common/Loading";
import { CommunityEntity } from "~/services/community/types/community";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import ProposalStatusActions from "./proposal-status-actions/ProposalStatusActions";
import { CardWrapper } from "./ProposalStyled";
import FCastMenuButton from "../FCastMenuButton";
import { FCastWithNftImage } from "./FCast";

export default function CastCollectList({
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
          <CardWrapper
            key={index.toString()}
            className="flex flex-col gap-4 px-4"
          >
            <FCastWithNftImage
              className="overflow-hidden"
              cast={cast}
              channel={channel!}
              tokenInfo={tokenInfo}
              proposal={proposal}
            />
            <View className="flex flex-row items-center justify-between">
              <FCastMenuButton
                cast={cast}
                communityInfo={channel as any}
                proposal={proposal}
              />
              <View className="ml-auto">
                <ProposalStatusActions
                  cast={cast}
                  channel={channel!}
                  tokenInfo={tokenInfo}
                  proposal={proposal}
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
