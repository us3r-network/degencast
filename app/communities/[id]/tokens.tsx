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
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import { Loading } from "~/components/common/Loading";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import ApplyLaunchButton from "~/components/common/ApplyLaunchButton";

export default function TokensScreen() {
  const { community } = useCommunityCtx();
  const communityToken = community?.tokens?.[0];
  const id = community?.channelId || "";
  const { communityDetail, loading } = useLoadCommunityDetail(id);
  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost = !!id && !!channels.find((channel) => channel.id === id);
  if (!communityDetail && loading) {
    return (
      <View className="flex-1 flex-col items-center justify-center">
        <Loading />
      </View>
    );
  }
  return (
    <View className="flex-1 flex-col">
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
        <>
          <ScrollView
            className="mx-auto h-full max-w-72 flex-1 flex-col items-center justify-center gap-8"
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
              Channel Share & Token Launch features are coming soon! {`\n`}
              When the shares are sold out, all the liquidity from the bonding
              curve will be deposited into {`\n`}
              Raydium and token launch will begain. {`\n`}
              {isChannelHost && `Please apply in advance.`}
            </Text>
          </ScrollView>
          {isChannelHost && (
            <View className=" py-5">
              <ApplyLaunchButton channelId={id} />
            </View>
          )}
        </>
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
            <Loading />
          </View>
        ) : null;
      }}
    />
  );
}
