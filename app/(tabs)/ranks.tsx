import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, View } from "react-native";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "~/components/common/Icons";
import { Loading } from "~/components/common/Loading";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { BuyButton, LaunchButton } from "~/components/trade/BadgeButton";
import { TradeButton } from "~/components/trade/TradeButton";
import { Card, CardContent } from "~/components/ui/card";
import { RadioGroup, RadioGroupItemButton } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import {
  DEFAULT_ORDER_PARAMS,
  OrderParams,
} from "~/features/rank/communityRankSlice";
import useCommunityRank from "~/hooks/rank/useCommunityRank";
import { CommunityRankOrderBy } from "~/services/community/types/rank";
import { Channel } from "~/services/farcaster/types";

export default function Ranks() {
  const { loading, items, load, hasMore } = useCommunityRank();
  const [orderParams, setOrderParams] =
    useState<OrderParams>(DEFAULT_ORDER_PARAMS);

  useEffect(() => {
    load(orderParams);
  }, [orderParams]);

  return (
    <SafeAreaView
      style={{ paddingTop: DEFAULT_HEADER_HEIGHT }}
      className="flex-1 bg-background"
    >
      <View className="box-border w-full flex-1 px-4">
        <Card className="relative mx-auto box-border w-full max-w-screen-sm flex-1 rounded-2xl p-2">
          <CardContent className="native:gap-2 h-full gap-4 p-0 sm:p-4">
            <OrderSelect setOrderParams={setOrderParams} />
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
            )}
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const RankOrderList = [
  { icon: <ArrowDownNarrowWide size="14" color="white" />, value: "DESC" },
  { icon: <ArrowUpNarrowWide size="14" color="white" />, value: "ASC" },
];
const RankOrderByList = [
  { label: "Market Cap", value: CommunityRankOrderBy.MARKET_CAP },
  { label: "Token Price", value: CommunityRankOrderBy.TOKEN_PRICE },
  { label: "New Casts", value: CommunityRankOrderBy.NEW_CASTS },
  { label: "Members", value: CommunityRankOrderBy.MEMBERS },
  { label: "Created Date", value: CommunityRankOrderBy.CREATED_DATE },
  { label: "Number of Trade", value: CommunityRankOrderBy.NUMBER_OF_TRADE },
  { label: "Growth Rate", value: CommunityRankOrderBy.GROWTH_RATE },
];
function OrderSelect({
  setOrderParams,
}: {
  setOrderParams: (orderParams: OrderParams) => void;
}) {
  const [order, setOrder] = useState(DEFAULT_ORDER_PARAMS.order);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_PARAMS.orderBy);
  useEffect(() => {
    setOrderParams({ order, orderBy });
  }, [order, orderBy]);
  return (
    <View className="flex-row items-center gap-2">
      <RadioGroup value={order} onValueChange={(v: any) => setOrder(v)}>
        <View className="flex-row items-center gap-2 rounded-lg border border-primary bg-primary/10 px-2 py-1">
          {RankOrderList.map((item) => (
            <RadioGroupItemButton
              key={item.value}
              value={item.value}
              aria-labelledby={item.value}
              className="border-none p-1"
            >
              <Text
                className={item.value === order ? "text-white" : "text-primary"}
              >
                {item.icon}
              </Text>
            </RadioGroupItemButton>
          ))}
        </View>
      </RadioGroup>
      <RadioGroup
        value={orderBy}
        onValueChange={(v: any) => setOrderBy(v)}
        className="no-scrollbar flex-1 overflow-x-auto"
      >
        <View className="flex-row items-center gap-2">
          {RankOrderByList.map((item) => (
            <RadioGroupItemButton
              key={item.value}
              value={item.value}
              aria-labelledby={item.value}
            >
              <Text
                className={
                  item.value === orderBy ? "text-white" : "text-primary"
                }
              >
                {item.label}
              </Text>
            </RadioGroupItemButton>
          ))}
        </View>
      </RadioGroup>
    </View>
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
        return item.newCastCount || "-";
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
  const button = useMemo(() => {
    switch (orderBy) {
      case CommunityRankOrderBy.MARKET_CAP:
      case CommunityRankOrderBy.TOKEN_PRICE:
      case CommunityRankOrderBy.NUMBER_OF_TRADE:
      case CommunityRankOrderBy.GROWTH_RATE:
        if (item.tokenInfo) return <TradeButton token2={item.tokenInfo} />;
      case CommunityRankOrderBy.NEW_CASTS:
      case CommunityRankOrderBy.MEMBERS:
        if (item.attentionTokenAddress) {
          return (
            <BuyButton
              name={item.name}
              logo={item.image_url}
              tokenAddress={item.attentionTokenAddress}
            />
          );
        } else {
          return (
            <LaunchButton
              channelId={item.id}
              onComplete={(tokenAddress) => {
                console.log("tokenAddress", tokenAddress);
                item.attentionTokenAddress = tokenAddress;
              }}
            />
          );
        }
      case CommunityRankOrderBy.CREATED_DATE:
        return <CommunityJoinButton channelId={item.id} />;
      default:
        return <CommunityJoinButton channelId={item.id} />;
    }
  }, [item, orderBy, item.attentionTokenAddress]);
  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-1 flex-row items-center gap-2">
        <Text className="w-6 text-center text-xs font-medium">{index}</Text>
        <Link
          className="flex-1"
          href={`/communities/${item.id}/feeds/casts`}
          asChild
        >
          <Pressable>
            <CommunityInfo name={item.name} logo={item.image_url} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm">{data}</Text>
        {button}
      </View>
    </View>
  );
}
