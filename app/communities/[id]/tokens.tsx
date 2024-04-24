import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, ScrollView, View } from "react-native";
import CommunityShareActivityItem from "~/components/community/CommunityShareActivityItem";
import CommunityTokenLaunchProgress from "~/components/community/CommunityTokenLaunchProgress";
import CommunityTokenInfo from "~/components/community/CommunityTokenInfo";
import { Text } from "~/components/ui/text";
import useLoadCommunityTokenInfo from "~/hooks/community/useLoadCommunityTokenInfo";
import { useCommunityCtx } from "./_layout";
import { Image } from "react-native";

export default function TokensScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const { community } = useCommunityCtx();
  const communityToken = community?.tokens?.[0];

  return (
    <View className="flex-1">
      {communityToken ? (
        <ScrollView className="flex-1" showsHorizontalScrollIndicator={false}>
          <CommunityTokenInfo
            tokenInfo={{
              standard: communityToken.tokenStandard,
              contract: communityToken.contract,
              chain: communityToken.tradeInfo.chain,
            }}
            tradeInfo={communityToken.tradeInfo}
          />
        </ScrollView>
      ) : (
        <ScrollView
          className=" mx-auto h-full max-w-72 flex-col items-center justify-center gap-8"
          showsHorizontalScrollIndicator={false}
        >
          <Image
            source={require("~/assets/images/no-token.png")}
            style={{ width: 280, height: 280 }}
          />
          <Text className=" text-center text-xl font-bold text-primary">
            Coming Soon
          </Text>
          <Text className="text-center text-base leading-8 text-secondary">
            The channel token launch progress hasn’t started yet.
          </Text>
        </ScrollView>
        // <ShareActivities id={id as string} />
      )}
    </View>
  );
}

function ShareActivities({ id }: { id: string }) {
  const { shareActivities, loading, loadTokenInfo } =
    useLoadCommunityTokenInfo();
  useEffect(() => {
    loadTokenInfo(id as string);
  }, [id]);
  return (
    <FlatList
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
          <CommunityShareActivityItem className="flex-1" shareActivity={item} />
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
    />
  );
}
