import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, View } from "react-native";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Loading } from "~/components/common/Loading";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { TradeButton } from "~/components/trade/TradeButton";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useCommunityRank from "~/hooks/trade/useCommunityRank";
import { Channel, CommunityRankOrderBy } from "~/services/farcaster/types";

export default function Ranks() {
  const { loading, items, load, hasMore } = useCommunityRank();
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [orderBy, setOrderBy] = useState<CommunityRankOrderBy>(
    CommunityRankOrderBy.MARKET_CAP,
  );
  return (
    <SafeAreaView
      style={{ paddingTop: DEFAULT_HEADER_HEIGHT }}
      className="flex-1 bg-background"
    >
      <View className="box-border w-full flex-1 px-4">
        <Card className="relative mx-auto box-border w-full max-w-screen-sm flex-1 rounded-2xl p-2">
          <CardContent className="native:gap-2 h-full gap-4 p-0 sm:p-4">
            {loading && items.length === 0 ? (
              <Loading />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={items}
                numColumns={1}
                ItemSeparatorComponent={() => <View className="h-4" />}
                renderItem={({
                  item,
                  index,
                }: {
                  item: Channel;
                  index: number;
                }) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      index={index + 1}
                      orderBy={orderBy}
                    />
                  );
                }}
                onEndReached={() => {
                  if (loading || !hasMore) return;
                  load({ order, orderBy });
                }}
                onEndReachedThreshold={1}
                ListFooterComponent={() => {
                  return loading ? <Loading /> : null;
                }}
              />
            )}
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function Item({
  item,
  index,
  orderBy,
}: {
  item: Channel;
  index: number;
  orderBy: CommunityRankOrderBy;
}) {
  const data = useMemo(() => {
    switch (orderBy) {
      case CommunityRankOrderBy.MARKET_CAP:
        const mc = item.tokenInfo?.tradeInfo?.stats?.fdv_usd;
        if (Number(mc) > 0)
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(Number(mc));
        else return "-";
      case CommunityRankOrderBy.TOKEN_PRICE:
        const price = item.tokenInfo?.tradeInfo?.stats?.token_price_usd;
        if (Number(price) > 0)
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(Number(price));
        else return "-";
      case CommunityRankOrderBy.NEW_CASTS:
        return item.new_casts_count || "-";
      case CommunityRankOrderBy.MEMBERS:
        return item.follower_count || "-";
      case CommunityRankOrderBy.CREATED_DATE:
        if (item.created_at)
          return new Intl.DateTimeFormat("en-US").format(
            new Date(item.created_at),
          );
        else return "-";
      case CommunityRankOrderBy.NUMBER_OF_TRADE:
        const trade = item.tokenInfo?.tradeInfo?.stats?.transactions?.h24;
        if (!trade) return 0;
        return trade.buys + trade.sells;
      case CommunityRankOrderBy.GROWTH_RATE:
        const growthRate =
          item.tokenInfo?.tradeInfo?.stats?.price_change_percentage?.h24;
        if (growthRate) return `${growthRate}%`;
        else return "-";
      default:
        return "";
    }
  }, [item, orderBy]);
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-medium">{index}</Text>
        <Link className="flex-1" href={`/communities/${item.id}/casts`} asChild>
          <Pressable>
            <CommunityInfo name={item.name} logo={item.image_url} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{data}</Text>
        {item.tokenInfo && <TradeButton token2={item.tokenInfo} />}
        {/* <CommunityJoinButton communityInfo={{item}} /> */}
      </View>
    </View>
  );
}
