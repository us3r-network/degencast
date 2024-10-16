import { Href, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { formatUnits } from "viem";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import { Loading } from "~/components/common/Loading";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import { CardWarper, PageContent } from "~/components/layout/content/Content";
import CreateChannelButton from "~/components/rank/CreateChannelButton";
import RankFilter from "~/components/rank/Filter";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { DEGEN_TOKEN_METADATA } from "~/constants";
import { DEFAULT_ORDER_PARAMS } from "~/features/rank/channelRankSlice";
import useChannelRank from "~/hooks/rank/useChannelRank";
import { Channel } from "~/services/farcaster/types";
import { OrderParams, RankOrderBy } from "~/services/rank/types";

const RankOrderByList = [
  { label: "Token Price", value: RankOrderBy.NFT_PRICE },
  { label: "Launch Progress", value: RankOrderBy.LAUNCH_PROGRESS },
  // { label: "New Proposals", value: RankOrderBy.NEW_PROPOSALS },
  // { label: "New Casts", value: RankOrderBy.NEW_CASTS },
  { label: "Followers", value: RankOrderBy.MEMBERS },
  { label: "Created Date", value: RankOrderBy.CREATED_DATE },
];

export default function ChannelsScreen() {
  const { loading, items, load, hasMore } = useChannelRank();
  const [orderParams, setOrderParams] =
    useState<OrderParams>(DEFAULT_ORDER_PARAMS);

  useEffect(() => {
    load(orderParams);
  }, [orderParams]);

  return (
    <PageContent>
      <View className="flex h-full gap-4">
        <RankFilter
          setOrderParams={setOrderParams}
          rankOrderByList={RankOrderByList}
          defaultOrder={DEFAULT_ORDER_PARAMS}
        />
        <CardWarper>
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
        </CardWarper>
        {/* <CreateChannelButton /> */}
      </View>
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
      case RankOrderBy.LAUNCH_PROGRESS:
        return item.progress || "-";
      case RankOrderBy.NFT_PRICE: //todo use payment token from api
        return item.price
          ? `${new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(
              Number(
                formatUnits(BigInt(item.price), DEGEN_TOKEN_METADATA.decimals!),
              ),
            )} ${DEGEN_TOKEN_METADATA.symbol}`
          : "-";
      case RankOrderBy.NEW_CASTS:
        return item.newCastCount || "-";
      case RankOrderBy.MEMBERS:
        return item.follower_count || "-";
      case RankOrderBy.CREATED_DATE:
        if (item.created_at)
          return new Intl.DateTimeFormat("en-US").format(
            new Date(item.created_at),
          );
        else return "-";
      default:
        return "";
    }
  }, [item, orderBy]);
  const button = useMemo(() => {
    switch (orderBy) {
      // case RankOrderBy.LAUNCH_PROGRESS:
      // case RankOrderBy.NFT_PRICE:
      //   return (
      //     <Link
      //       href={`/communities/${item.id}/casts` as Href}
      //       asChild
      //     >
      //       <Button variant={"secondary"} size="sm" className="min-w-16 px-0">
      //         <Text>Curate</Text>
      //       </Button>
      //     </Link>
      //   );
      // case RankOrderBy.CREATED_DATE: // remove this later
      //   if (item.attentionTokenAddress) {
      //     return (
      //       <>
      //         <BuyButton
      //           token={{
      //             contractAddress: item.attentionTokenAddress,
      //             tokenId: 0,
      //           }}
      //         />
      //         <SellButton
      //           token={{
      //             contractAddress: item.attentionTokenAddress,
      //             tokenId: 0,
      //           }}
      //         />
      //       </>
      //     );
      //   } else {
      //     return (
      //       <CreateTokenButton
      //         channelId={item.id}
      //         onComplete={(tokenAddress) => {
      //           console.log("tokenAddress", tokenAddress);
      //           item.attentionTokenAddress = tokenAddress;
      //         }}
      //       />
      //     );
      //   }
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
          href={`/communities/${item.id}/casts` as Href}
          asChild
        >
          <Pressable>
            <CommunityInfo
              name={item.name}
              logo={item.image_url}
              id={item.id}
            />
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
