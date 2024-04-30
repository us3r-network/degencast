import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import CommunityMemberTipsItem from "~/components/community/CommunityMemberTipsItem";
import { Text } from "~/components/ui/text";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";

export default function TipsRankScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const { tipsRank, loading, loadTipsRank } = useLoadCommunityTipsRank(id);
  return (
    <View className="flex-1">
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View className="mb-5 flex-row justify-between">
              <Text className=" text-base font-medium">Rank</Text>
              <Text className=" text-base font-medium">Tips Received</Text>
            </View>
          );
        }}
        data={tipsRank}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => {
          return (
            <CommunityMemberTipsItem className="flex-1" memberTips={item} />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          if (tipsRank.length === 0 || loading) return;
          loadTipsRank();
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => {
          return loading ? (
            <View className="flex items-center justify-center p-5">
              <Text>Loading ...</Text>
            </View>
          ) : null;
        }}
      />
    </View>
  );
}
