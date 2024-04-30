import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import CommunityMemberShareItem from "~/components/community/CommunityMemberShareItem";
import { Text } from "~/components/ui/text";
import useLoadCommunityMembersShare from "~/hooks/community/useLoadCommunityMembersShare";
import { useCommunityCtx } from "./_layout";
import CommunityBuyShareButton from "~/components/community/CommunityBuyShareButton";
import useLoadCommunityShareStatistics from "~/hooks/community/useLoadCommunityShareStatistics";
import { Image } from "react-native";

export default function SharesScreen() {
  const { community } = useCommunityCtx();
  const communityShare = community?.shares?.[0];
  const subjectAddress = communityShare?.subjectAddress;
  if (subjectAddress) {
    return <HasSubjectAddress />;
  }
  return <NoSubjectAddress />;
}

function HasSubjectAddress() {
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const { membersShare, loading, loadMembersShare } =
    useLoadCommunityMembersShare(id);
  const { idle, shareStatistics, loadShareStatistics } =
    useLoadCommunityShareStatistics(id);

  useEffect(() => {
    if (idle) {
      loadShareStatistics();
    }
  }, [idle]);

  const { community } = useCommunityCtx();
  if (!community) return null;
  return (
    <View className="flex-1 flex-col">
      <View className="flex-1">
        <FlatList
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <View className="mb-5 flex-row justify-between">
                <Text className=" text-base font-medium">
                  Holders ({shareStatistics?.holders || 0})
                </Text>
                <Text className=" text-base font-medium">
                  Shares ({shareStatistics.supply || 0})
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
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (membersShare.length === 0 || loading) return;
            loadMembersShare();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            return loading ? (
              <View className="flex items-center justify-center p-5">
                <Text>Loading ...</Text>
              </View>
            ) : null;
          }}
          ListEmptyComponent={() => {
            if (loading) return null;
            return (
              <View className=" mx-auto h-full max-w-72 flex-col items-center justify-center gap-8">
                <Image
                  source={require("~/assets/images/no-shares.png")}
                  style={{ width: 280, height: 280 }}
                />
                <Text className=" text-center text-xl font-bold text-primary">
                  Congratulations!
                </Text>
                <Text className="text-center text-base leading-8 text-secondary">
                  You have a chance to be the first share holder!
                </Text>
              </View>
            );
          }}
        />
      </View>
      <View className=" pt-5">
        <CommunityBuyShareButton communityInfo={community} />
      </View>
    </View>
  );
}

function NoSubjectAddress() {
  return (
    <View className=" mx-auto h-full max-w-72 flex-col items-center justify-center gap-8">
      <Image
        source={require("~/assets/images/no-shares.png")}
        style={{ width: 280, height: 280 }}
      />
      <Text className=" text-xl font-bold text-primary">
        No subject address
      </Text>
    </View>
  );
}
