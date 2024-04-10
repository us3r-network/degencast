import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import CommunityMemberShareItem from "~/components/community/CommunityMemberShareItem";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useLoadCommunityMembersShare from "~/hooks/community/useLoadCommunityMembersShare";

export default function SharesScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { membersShare, loading, loadMembersShare } =
    useLoadCommunityMembersShare();
  useEffect(() => {
    loadMembersShare(id as string);
  }, [id]);

  return (
    <View className="flex-1 flex-col">
      <View className="flex-1">
        <FlatList
          ListHeaderComponent={() => {
            return (
              <View className="mb-5 flex-row justify-between">
                <Text className=" text-base font-medium">Holders (9999)</Text>
                <Text className=" text-base font-medium">
                  Activities (9999)
                </Text>
              </View>
            );
          }}
          data={membersShare}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => {
            return (
              <CommunityMemberShareItem className="flex-1" memberShare={item} />
            );
          }}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (membersShare.length === 0 || loading) return;
            loadMembersShare(id as string);
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
      <View className=" pt-5">
        <Button
          className=" bg-secondary"
          onPress={() => {
            alert("TODO");
          }}
        >
          <Text>Buy with 9,999 DEGEN</Text>
        </Button>
      </View>
    </View>
  );
}
