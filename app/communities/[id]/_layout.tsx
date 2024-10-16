import { Stack, useLocalSearchParams, useNavigation, Link, Href } from "expo-router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, SafeAreaView } from "react-native";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { EditIcon } from "~/components/common/SvgIcons";
import CommunityDetailMetaInfo, {
  CommunityDetailMetaInfoDropdown,
} from "~/components/community/CommunityDetailMetaInfo";
import { Button } from "~/components/ui/button";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import { CommunityData } from "~/services/community/api/community";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScrollTabBar } from "~/components/layout/material-top-tabs/TabBar";
import { ScreenLoading } from "~/components/common/Loading";
import NotFoundChannel from "~/components/community/NotFoundChannel";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import SelectionFeeds from "./selections";
import ProposalFeeds from "./proposal";
import CastFeeds from "./casts";
import CuratorsScreen from "./curators";
import ActivitiesScreen from "./activities";
import AttentionTokenScreen from "./attention-token";
import TokensScreen from "./tokens/[contract]";
import LaunchProgress from "~/components/community/LaunchProgress";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
import { CreateTokenButton } from "~/components/onchain-actions/att/ATTCreateButton";
import { CommunitySharingIconBtn } from "~/components/platform-sharing/PlatformSharingButton";
import Constants from 'expo-constants'

const initialRouteName = "selection";

const Tab = createMaterialTopTabNavigator();

const CommunityContext = createContext<{
  community: CommunityData | null | undefined;
  tokens?: CommunityData["tokens"];
  tokenInfo?: AttentionTokenEntity | null | undefined;
  loading: boolean;
}>({
  community: null,
  tokenInfo: null,
  loading: false,
});

export function useCommunityCtx() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunityCtx must be used within CommunityContext");
  }
  return context;
}

export default function CommunityDetail() {
  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id: channelId } = params as { id: string };
  const {
    communityDetail,
    communityBasic,
    loading,
    rejected,
    loadCommunityDetail,
  } = useLoadCommunityDetail(channelId);
  const baseRoutes = [
    { key: "casts", title: "Cast", component: CastFeeds },
    // { key: "vote", title: "Like", component: ProposalFeeds },
    { key: "collect", title: "Mint", component: SelectionFeeds },
    { key: "activities", title: "Activity", component: ActivitiesScreen },
    // { key: "curators", title: "DegenCaster", component: CuratorsScreen },
  ];

  const community = communityDetail || communityBasic;
  const tokenInfo = communityDetail?.attentionTokenInfo;

  const symbol =
    community?.channelId === "home"
      ? "CAST"
      : community?.channelId?.toUpperCase();
  const attTokenRoute = tokenInfo?.tokenContract
    ? {
        key: community.channelId,
        title: `$${symbol}`,
        component: AttentionTokenScreen,
      }
    : null;
  const tokenContracts = useRef(new Set<string>());
  const tokens = useMemo(() => {
    return (
      communityDetail?.tokens?.filter((token) => {
        if (!token?.tradeInfo || tokenContracts.current.has(token.contract)) {
          return false;
        }
        tokenContracts.current.add(token.contract);
        return true;
      }) || []
    );
  }, [communityDetail?.tokens]);
  const tokenRoutes = useMemo(() => {
    return tokens.map((token) => {
      return {
        key: `${token.contract}`,
        title: `${token?.tradeInfo?.name} Token`,
        component: TokensScreen,
        initParams: { contract: token.contract },
      };
    });
  }, [tokens]);

  const routes = [
    ...baseRoutes,
    ...(attTokenRoute ? [attTokenRoute] : []),
    ...tokenRoutes,
  ] as Array<any>;

  useEffect(() => {
    if (loading || rejected || communityDetail) return;
    loadCommunityDetail();
  }, [loading, rejected, communityDetail, loadCommunityDetail]);

  const { currFid } = useFarcasterAccount();
  const { channels } = useUserHostChannels(Number(currFid));
  const isChannelHost =
    !!channelId && !!channels.find((channel) => channel.id === channelId);

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
                <Text className="font-bold text-primary-foreground max-sm:hidden">
                  Channel
                </Text>
                {/* mobile */}
                <View className=" sm:hidden">
                  {community && (
                    <CommunityDetailMetaInfoDropdown community={community} />
                  )}
                </View>
              </View>
              <View className="flex flex-row items-center gap-[10px] max-sm:hidden">
                <Link
                  href={`/create${channelId ? "?channelId=" + channelId : ""}` as Href}
                  asChild
                >
                  <Button variant={"link"} className="m-0 p-0">
                    <EditIcon className=" h-6 w-6 cursor-pointer stroke-white" />
                  </Button>
                </Link>
                <CommunitySharingIconBtn
                  channelId={channelId}
                  name={community?.name}
                />
              </View>
              {tokenInfo ? (
                <View className="sm:hidden">
                  <LaunchProgress
                    textClassName="text-white"
                    tokenInfo={tokenInfo}
                  />
                </View>
              ) : (
                <View className="sm:hidden">
                  {community && (
                    <CreateTokenButton
                      channelId={channelId}
                      onComplete={() => {
                        loadCommunityDetail();
                      }}
                      className="h-8"
                      variant={"secondary"}
                      renderButtonContent={({ loading }) => {
                        return loading ? (
                          <Text className="text-lg text-secondary-foreground">
                            {isChannelHost ? "Launching..." : "Activating..."}
                          </Text>
                        ) : (
                          <Text className="text-lg text-secondary-foreground">
                            {isChannelHost ? "Launch" : "Activate"}
                          </Text>
                        );
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          ),
        }}
      />
      <View className="native:mt-12 m-auto  w-full flex-1 flex-col gap-4 p-4 py-0 sm:w-full sm:max-w-screen-sm">
        {community ? (
          <>
            <CommunityDetailMetaInfo
              communityInfo={community}
              className=" max-sm:hidden "
            />
            <View className="box-border w-full flex-1">
              <CommunityContext.Provider
                value={{ community, tokenInfo, loading, tokens }}
              >
                {communityDetail ? (
                  <Tab.Navigator
                    screenOptions={{
                      lazy: true,
                      lazyPreloadDistance: 1,
                    }}
                    initialRouteName={initialRouteName}
                    tabBar={(props) => <ScrollTabBar {...props} />}
                    sceneContainerStyle={{
                      backgroundColor: "transparent",
                      paddingTop: 15,
                    }}
                  >
                    {routes.map((route) => {
                      return (
                        <Tab.Screen
                          key={route.key}
                          name={route.key}
                          component={route.component}
                          {...(route?.initParams
                            ? { initialParams: route.initParams }
                            : {})}
                          options={{
                            title: route.title,
                          }}
                        />
                      );
                    })}
                  </Tab.Navigator>
                ) : null}
              </CommunityContext.Provider>
            </View>
          </>
        ) : loading ? (
          <View className="flex flex-1 items-center justify-center">
            <ScreenLoading />
          </View>
        ) : (
          <NotFoundChannel />
        )}
      </View>
    </SafeAreaView>
  );
}
