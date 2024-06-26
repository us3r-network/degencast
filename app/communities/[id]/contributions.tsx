import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import CommunityMemberTipsItem from "~/components/community/CommunityMemberTipsItem";
import { Text } from "~/components/ui/text";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";
import { useCommunityCtx } from "./_layout";
import { Image } from "react-native";
import { Loading } from "~/components/common/Loading";

export default function ContributionsScreen() {
  const { community } = useCommunityCtx();
  const communityShare = community?.shares?.[0];
  const subjectAddress = communityShare?.subjectAddress;
  // if (subjectAddress) {
  //   return <HasSubjectAddress />;
  // }
  return <NoSubjectAddress />;
}

function HasSubjectAddress() {
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
              <Loading />
            </View>
          ) : null;
        }}
      />
    </View>
  );
}

function NoSubjectAddress() {
  return (
    <View className=" mx-auto h-full max-w-[350px] flex-col items-center justify-center gap-7">
      <Image
        source={require("~/assets/images/no-shares.png")}
        style={{ width: 280, height: 280 }}
      />
      <Text className=" text-center text-xl font-bold text-primary">
        Coming Soon
      </Text>
      <Text className="text-center text-base leading-8 text-secondary">
        Contribute to Channel {`\n`}
        Earn $DEGEN & $CAST!
      </Text>
    </View>
  );
}
