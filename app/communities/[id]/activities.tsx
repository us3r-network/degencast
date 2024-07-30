import useLoadChannelOnchainActivities from "~/hooks/activity/useLoadChannelOnchainActivities";
import { useCommunityCtx } from "./_layout";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import ActivityItem from "~/components/activity/ActivityItem";
import { Loading } from "~/components/common/Loading";

export default function ActivitiesScreen() {
  const { community, tokenInfo } = useCommunityCtx();

  const channelId = community?.channelId || "";
  const { items, loading, loadItems } = useLoadChannelOnchainActivities({
    channelId,
  });
  useEffect(() => {
    loadItems();
  }, [channelId]);
  return (
    <FlatList
      className="h-full flex-1 gap-4"
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
