import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import CommunityShareActivityItem from "~/components/community/CommunityShareActivityItem";
import CommunityTokenLaunchProgress from "~/components/community/CommunityTokenLaunchProgress";
import CommunityTokenInfo from "~/components/community/CommunityTokenInfo";
import { Text } from "~/components/ui/text";
import useLoadCommunityTokenInfo from "~/hooks/community/useLoadCommunityTokenInfo";

export default function TokensScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { shareActivities, loading, loadTokenInfo } =
    useLoadCommunityTokenInfo();
  useEffect(() => {
    loadTokenInfo(id as string);
  }, [id]);

  return (
    <View className="flex-1">
      <CommunityTokenInfo
        chain={"base"}
        poolAddress="0xc9034c3e7f58003e6ae0c8438e7c8f4598d5acaa"
      />
      {/* <FlatList
        ListHeaderComponent={() => {
          return (
            <View>
              <CommunityTokenLaunchProgress data={null} />
              <View className=" my-5">
                <Text className=" text-base font-medium">Activities</Text>
              </View>
            </View>
          );
        }}
        data={shareActivities}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => {
          return (
            <CommunityShareActivityItem
              className="flex-1"
              shareActivity={item}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (shareActivities.length === 0 || loading) return;
          loadTokenInfo(id as string);
        }}
        onEndReachedThreshold={1}
        ListFooterComponent={() => {
          return loading ? (
            <View className="flex items-center justify-center p-5">
              <Text>Loading ...</Text>
            </View>
          ) : null;
        }}
      /> */}
    </View>
  );
}
