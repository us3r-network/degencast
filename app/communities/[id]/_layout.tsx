import { useHeaderHeight } from "@react-navigation/elements";
import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useSegments,
  useNavigation,
} from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import GoBackButton, {
  GoBackButtonBgPrimary,
} from "~/components/common/GoBackButton";
import CommunityDetailMetaInfo from "~/components/community/CommunityDetailMetaInfo";
import CommunityJoinButton, {
  CommunityJoinIconButton,
} from "~/components/community/CommunityJoinButton";
import PlatformSharingButton from "~/components/platform-sharing/PlatformSharingButton";
import UserGlobalPoints from "~/components/point/UserGlobalPoints";
import { Card } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useLoadCommunityCasts from "~/hooks/community/useLoadCommunityCasts";
import useLoadCommunityDetail from "~/hooks/community/useLoadCommunityDetail";
import useLoadCommunityMembersShare from "~/hooks/community/useLoadCommunityMembersShare";
import useLoadCommunityTipsRank from "~/hooks/community/useLoadCommunityTipsRank";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { cn } from "~/lib/utils";
import { CommunityData } from "~/services/community/api/community";
import {
  getCommunityFrameLink,
  getCommunityWebsiteLink,
} from "~/utils/platform-sharing/link";
import {
  getCommunityShareTextWithTwitter,
  getCommunityShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";

const initialRouteName = "tokens";

const TABS = [
  { label: "Tokens", value: "tokens" },
  { label: "Shares", value: "shares" },
  { label: "Tips Rank", value: "tips-rank" },
  { label: "Casts", value: "casts" },
];

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
  const params = useLocalSearchParams<{ id: string }>();
  const { id } = params;
  const segments = useSegments();
  const [activeScreen, setActiveScreen] = useState(initialRouteName);
  useEffect(() => {
    if (segments?.[2]) {
      setActiveScreen(segments[2]);
    }
  }, [segments]);
  const router = useRouter();
  const { communityDetail, communityBasic, loading, loadCommunityDetail } =
    useLoadCommunityDetail(id);

  const community = communityDetail || communityBasic;

  useEffect(() => {
    if (!communityDetail) {
      loadCommunityDetail();
    }
  }, [communityDetail, loadCommunityDetail]);

  const { tipsRank, loadTipsRank } = useLoadCommunityTipsRank(id);
  const { membersShare, loadMembersShare } = useLoadCommunityMembersShare(id);
  const { casts, loadCasts } = useLoadCommunityCasts(id);

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

  useEffect(() => {
    if (casts.length === 0) {
      loadCasts();
    }
  }, [casts]);

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
                <Text className=" text-xl font-bold text-primary-foreground">
                  Channel
                </Text>
              </View>
              <View className="flex flex-row items-center gap-4">
                <UserGlobalPoints />
                {community && (
                  <CommunityJoinIconButton communityInfo={community} />
                )}
                <View>
                  <PlatformSharingButton
                    twitterText={getCommunityShareTextWithTwitter(
                      community?.name || "",
                    )}
                    warpcastText={getCommunityShareTextWithWarpcast(
                      community?.name || "",
                    )}
                    websiteLink={getCommunityWebsiteLink(id, {
                      fid: currFid,
                    })}
                    frameLink={getCommunityFrameLink(id, {
                      fid: currFid,
                    })}
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
            <CommunityDetailMetaInfo communityInfo={community} />
            <View className="box-border w-full flex-1 pt-7">
              <Tabs
                value={activeScreen}
                onValueChange={(value) => {
                  setActiveScreen(value);
                  router.push(`/communities/${id}/${value}` as any);
                }}
                className=" absolute left-1/2 top-0 z-10 box-border w-full -translate-x-1/2"
              >
                <TabsList className="flex-row rounded-full bg-white shadow-lg">
                  {TABS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      className={cn("flex-1 flex-row rounded-full")}
                      value={tab.value}
                    >
                      <Text
                        className={cn(
                          "whitespace-nowrap text-primary",
                          activeScreen === tab.value &&
                            "text-primary-foreground",
                        )}
                      >
                        {tab.label}
                      </Text>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Card className="box-border h-full w-full rounded-b-none p-5 pb-0 ">
                <CommunityContext.Provider value={{ community, loading }}>
                  <Stack
                    initialRouteName={initialRouteName}
                    screenOptions={{
                      header: () => null,
                      contentStyle: { backgroundColor: "white" },
                    }}
                  />
                </CommunityContext.Provider>
              </Card>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
