import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import CommunityMemberTipsItem from "~/components/community/CommunityMemberTipsItem";
import { Text } from "~/components/ui/text";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";

export default function TipsRankScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { tipsRank, loading, loadTipsRank } = useLoadCommunityTipsRank();
  useEffect(() => {
    loadTipsRank(id as string);
  }, [id]);

  return (
    <View className="flex-1">
      <FlatList
        data={tipsRank}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => {
          return (
            <CommunityMemberTipsItem className="flex-1" memberTips={item} />
          );
        }}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (tipsRank.length === 0 || loading) return;
          loadTipsRank(id as string);
        }}
        onEndReachedThreshold={1}
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
