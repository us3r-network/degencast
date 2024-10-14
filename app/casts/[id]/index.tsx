import Constants from "expo-constants";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { ChevronDown } from "~/components/common/Icons";
import { Loading } from "~/components/common/Loading";
import { headerHeight } from "~/components/explore/ExploreStyled";
import FCastDetailsCard from "~/components/social-farcaster/FCastDetailsCard";
import FCastReplyCard from "~/components/social-farcaster/FCastReplyCard";
import { Separator } from "~/components/ui/separator";
import useCastDetails from "~/hooks/social-farcaster/useCastDetails";
import useCastReplies from "~/hooks/social-farcaster/useCastReplies";
import { getCastRepliesCount } from "~/utils/farcaster/cast-utils";

export default function CastDetail() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id: castHash } = params as { id: string; fid?: string };

  const {
    castDetailData,
    loading: castLoading,
    loadCastDetail,
  } = useCastDetails();
  const { cast, channel, proposal, tokenInfo } = castDetailData || {};

  const {
    items: replies,
    loadItems: loadReplies,
    loading: repliesLoading,
  } = useCastReplies({
    castHash,
  });

  useEffect(() => {
    loadCastDetail(castHash);
  }, [castHash]);

  useEffect(() => {
    loadReplies();
  }, [castHash]);

  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  const showGoHomeBtn = prevRoute?.name !== "(tabs)";

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          header: () => (
            <View
              style={{
                height: headerHeight,
                paddingLeft: 15,
                paddingRight: 15,
                marginTop: Constants.statusBarHeight, // 确保顶部与状态栏不重叠
              }}
              className="flex-row items-center justify-between bg-primary"
            >
              <View className="flex flex-row items-center gap-3">
                <GoBackButtonBgPrimary
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <Text className=" text-xl font-bold text-primary-foreground">
                  Cast
                </Text>
              </View>
            </View>
          ),
        }}
      />
      <View className=" m-auto  w-full flex-1 flex-col gap-4 p-4 py-0 sm:w-full sm:max-w-screen-sm">
        <FlatList
          style={{
            flex: 1,
          }}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => {
            if (!cast && castLoading) {
              return (
                <View className="flex h-full w-full items-center justify-center">
                  <Loading />
                </View>
              );
            }
            if (!cast) {
              return null;
            }
            return (
              <View>
                <FCastDetailsCard
                  channel={channel!}
                  tokenInfo={tokenInfo!}
                  cast={cast}
                  proposal={proposal!}
                />
                <View className="my-4 flex w-full flex-row items-center justify-between">
                  <Text className=" text-base font-bold text-secondary">
                    Comments ({getCastRepliesCount(cast)})
                  </Text>
                  {/* <ChevronDown className=" stroke-secondary" /> */}
                </View>
              </View>
            );
          }}
          data={!!cast ? replies : []}
          ItemSeparatorComponent={() => (
            <Separator className=" mb-4 bg-primary/10" />
          )}
          renderItem={({ item }) => {
            const { cast, channel, tokenInfo, proposal } = item;
            return (
              <FCastReplyCard
                channel={channel!}
                tokenInfo={tokenInfo!}
                cast={cast}
                proposal={proposal!}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (
              !cast ||
              repliesLoading ||
              (!repliesLoading && replies?.length === 0)
            )
              return;
            loadReplies();
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => {
            if (!castLoading && repliesLoading) {
              return <Loading />;
            }
            return <View className="mb-4" />;
          }}
        />
      </View>
    </SafeAreaView>
  );
}
