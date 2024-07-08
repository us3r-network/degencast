import { FlatList, View } from "react-native";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
import { useEffect } from "react";
// import { Separator } from "~/components/ui/separator";
// import ActivityItem from "~/components/activity/ActivityItem";
// import { Loading } from "~/components/common/Loading";
import { useGlobalSearchParams } from "expo-router";
import ActivitiesTable from "~/components/activity/ActivitiesTable";
export default function OnchainScreen() {
  const globalParams = useGlobalSearchParams();
  const { id: channelId } = globalParams as { id: string };
  const { items, loading, loadItems } = useLoadOnchainActivities({
    channelId,
  });
  useEffect(() => {
    loadItems();
  }, []);
  return (
    <View className="h-full w-full">
      <ActivitiesTable
        items={items}
        loading={loading}
        onEndReached={() => {
          if (loading || (!loading && items?.length === 0)) return;
          loadItems();
          return;
        }}
      />
      {/* <FlatList
        style={{
          flex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        data={items}
        ItemSeparatorComponent={() => (
          <Separator className=" my-4 bg-primary/10" />
        )}
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
      /> */}
    </View>
  );
}
