import { FlatList, View } from "react-native";
import useLoadOnchainActivities from "~/hooks/activity/useLoadOnchainActivities";
// import { Separator } from "../ui/separator";
// import { Loading } from "../common/Loading";
// import ActivityItem from "./ActivityItem";
import { useEffect } from "react";
import ActivitiesTable from "./ActivitiesTable";
export default function PowerusersActivities() {
  const { items, loading, loadItems } = useLoadOnchainActivities({
    type: "powerusers",
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
          <Separator className=" my-3 bg-primary/10" />
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
