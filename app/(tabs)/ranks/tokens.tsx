import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Loading } from "~/components/common/Loading";
import { TokenInfo } from "~/components/common/TokenInfo";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import { TradeButton } from "~/components/trade/TradeButton";
import { Text } from "~/components/ui/text";
import { DEFAULT_ORDER_PARAMS } from "~/features/rank/tokenRankSlice";
import useTokenRank from "~/hooks/rank/useTokenRank";
import { Channel } from "~/services/farcaster/types";
import { OrderParams, RankOrderBy } from "~/services/rank/types";
import { OrderSelect } from ".";

const RankOrderByList = [
  { label: "Market Cap", value: RankOrderBy.MARKET_CAP },
  { label: "Token Price", value: RankOrderBy.TOKEN_PRICE },
  { label: "Number of Trade", value: RankOrderBy.NUMBER_OF_TRADE },
  { label: "Growth Rate", value: RankOrderBy.GROWTH_RATE },
];

export default function TokensScreen() {
  const { loading, items, load, hasMore } = useTokenRank();
  const [orderParams, setOrderParams] =
    useState<OrderParams>(DEFAULT_ORDER_PARAMS);

  useEffect(() => {
    load(orderParams);
  }, [orderParams]);

  return (
    <PageContent>
      <CardWarper>
        <View className="flex h-full gap-4">
          <OrderSelect
            setOrderParams={setOrderParams}
            rankOrderByList={RankOrderByList}
            defaultOrder={DEFAULT_ORDER_PARAMS}
          />
          {loading && items.length === 0 ? (
            <Loading />
          ) : (
            <View className="flex-1">
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
                      orderBy={orderParams.orderBy}
                    />
                  );
                }}
                onEndReached={() => {
                  if (loading || !hasMore) return;
                  load(orderParams);
                }}
                onEndReachedThreshold={1}
                ListFooterComponent={() => {
                  return loading ? <Loading /> : null;
                }}
              />
            </View>
          )}
        </View>
      </CardWarper>
    </PageContent>
  );
}

function Item({
  item,
  index,
  orderBy,
}: {
  item: Channel;
  index: number;
  orderBy: RankOrderBy;
}) {
  const data = useMemo(() => {
    switch (orderBy) {
      case RankOrderBy.MARKET_CAP:
        const mc = item.tokenInfo?.tradeInfo?.stats?.fdv_usd;
        if (Number(mc) > 0)
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(Number(mc));
        else return "-";
      case RankOrderBy.TOKEN_PRICE:
        const price = item.tokenInfo?.tradeInfo?.stats?.token_price_usd;
        if (Number(price) > 0)
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(Number(price));
        else return "-";
      case RankOrderBy.NUMBER_OF_TRADE:
        const trade = item.tokenInfo?.tradeInfo?.stats?.transactions?.h24;
        if (!trade) return 0;
        return trade.buys + trade.sells;
      case RankOrderBy.GROWTH_RATE:
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
            <TokenInfo
              name={item.tokenInfo?.name}
              symbol={item.tokenInfo?.symbol}
              logo={item.tokenInfo?.logoURI}
            />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{data}</Text>
        <TradeButton token2={item.tokenInfo} />
      </View>
    </View>
  );
}
