import { Stack, useLocalSearchParams, useNavigation, Link } from "expo-router";
import { createContext, useContext, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { Search } from "~/components/common/Icons";
import { EditIcon } from "~/components/common/SvgIcons";
import CommunityDetailMetaInfo, {
  CommunityDetailMetaInfoDropdown,
} from "~/components/community/CommunityDetailMetaInfo";
import { CommunitySharingButton } from "~/components/platform-sharing/PlatformSharingButton";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import useLoadCommunityMembersShare from "~/hooks/community/useLoadCommunityMembersShare";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { CommunityData } from "~/services/community/api/community";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TokensScreen from "./tokens";
import ContributionsScreen from "./contributions";
import DefaultTabBar from "~/components/layout/material-top-tabs/TabBar";
import FeedsLayout from "./feeds/_layout";

const initialRouteName = "tokens";

const Tab = createMaterialTopTabNavigator();

const CommunityContext = createContext<{
  community: CommunityData | null | undefined;
  loading: boolean;
}>({
  community: null,
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
  const { currFid } = useFarcasterAccount();
  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { id: channelId } = params as { id: string };
  const { communityDetail, communityBasic, loading, loadCommunityDetail } =
    useLoadCommunityDetail(channelId);

  const community = communityDetail || communityBasic;

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);

  const { tipsRank, loadTipsRank } = useLoadCommunityTipsRank(channelId);
  const { membersShare, loadMembersShare } =
    useLoadCommunityMembersShare(channelId);
  useLoadCommunityCasts(channelId);

  useEffect(() => {
    if (tipsRank.length === 0) {
      loadTipsRank();
    }
  }, [tipsRank]);

  useEffect(() => {
    if (membersShare.length === 0) {
      loadMembersShare();
    }
  }, [membersShare]);

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
              }}
              className="flex-row items-center justify-between bg-primary"
            >
              <View className="flex flex-row items-center gap-3">
                <GoBackButtonBgPrimary
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                <Text className=" text-xl font-bold text-primary-foreground max-sm:hidden">
                  Channel
                </Text>
                <View className=" sm:hidden">
                  {community && (
                    <CommunityDetailMetaInfoDropdown community={community} />
                  )}
                </View>
              </View>
              <View className="flex flex-row items-center gap-[10px]">
                <UserGlobalPoints />
                <Link href="/search" asChild>
                  <Button variant={"link"} className="m-0 p-0">
                    <Search className=" h-6 w-6 cursor-pointer stroke-white" />
                  </Button>
                </Link>
                <Link
                  href={`/create${channelId ? "?channelId=" + channelId : ""}`}
                  asChild
                >
                  <Button variant={"link"} className="m-0 p-0">
                    <EditIcon className=" h-6 w-6 cursor-pointer stroke-white" />
                  </Button>
                </Link>
                <View>
                  <CommunitySharingButton
                    name={community?.name || ""}
                    channelId={channelId || ""}
                    currFid={currFid}
                  />
                </View>
              </View>
            </View>
          ),
        }}
      />
      <View className=" m-auto  w-full flex-1 flex-col gap-4 p-4 py-0 sm:w-full sm:max-w-screen-sm">
        {community && (
          <>
            <CommunityDetailMetaInfo
              communityInfo={community}
              className=" max-sm:hidden "
            />
            <View className="box-border w-full flex-1">
              <Card className="box-border h-full w-full rounded-[20px] rounded-b-none p-4 pb-0">
                <CommunityContext.Provider value={{ community, loading }}>
                  <Tab.Navigator
                    initialRouteName={initialRouteName}
                    tabBar={(props) => <DefaultTabBar {...props} />}
                    sceneContainerStyle={{
                      backgroundColor: "white",
                      paddingTop: 15,
                    }}
                  >
                    <Tab.Screen
                      name="tokens"
                      component={TokensScreen}
                      options={{
                        title: "Tokens",
                      }}
                    />
                    <Tab.Screen
                      name="contributions"
                      component={ContributionsScreen}
                      options={{
                        title: "Contributions",
                      }}
                    />
                    <Tab.Screen
                      name="feeds"
                      component={FeedsLayout}
                      options={{
                        title: "Feeds",
                      }}
                    />
                  </Tab.Navigator>
                </CommunityContext.Provider>
              </Card>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
