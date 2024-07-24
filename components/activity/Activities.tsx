import { useEffect } from "react";
import { FlatList, View } from "react-native";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
import { Loading } from "../common/Loading";
import ActivityItem from "./ActivityItem";
import { ERC42069Token } from "~/services/trade/types";
import { ActivityFilterType } from "~/services/community/types/activity";

export default function Activities({
  channelId,
  fid,
  token,
  type,
}: {
  channelId?: string;
  fid?: number;
  token?: ERC42069Token;
  type?: ActivityFilterType;
}) {
  const { items, loading, loadItems } = useLoadOnchainActivities({
    channelId,
    token,
    type,
  });
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <FlatList
      className="flex-1 h-full gap-4"
      contentContainerClassName="flex gap-4"
      showsHorizontalScrollIndicator={false}
      data={items}
      renderItem={({ item }) => {
        return <ActivityItem data={item} />;
      }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => {
        if (loading || (!loading && items?.length === 0)) return;
        loadItems();
        return;
      }}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() => {
        if (loading) {
          return <Loading />;
        }
        return <View className="mb-10" />;
      }}
    />
  );
}
