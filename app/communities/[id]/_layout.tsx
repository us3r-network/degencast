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
import { Share2 } from "~/components/common/Icons";
import CommunityDetailMetaInfo from "~/components/community/CommunityDetailMetaInfo";
import CommunityJoinButton from "~/components/community/CommunityJoinButton";
import PlatformSharingButton from "~/components/platform-sharing/PlatformSharingButton";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  const headerHeight = useHeaderHeight();
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
            <View className="flex flex-row items-center justify-between bg-primary">
              <View className="flex flex-row items-center">
                <View className="w-fit p-3 ">
                  <Button
                    className="rounded-full bg-[#a36efe1a]"
                    size={"icon"}
                    variant={"ghost"}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <BackArrowIcon />
                  </Button>
                </View>
                <Text className=" font-interBold ml-2 text-xl  leading-none text-primary-foreground">
                  {community?.name}
                </Text>
              </View>
              <View className="mr-5 flex flex-row items-center gap-3">
                {community && <CommunityJoinButton communityInfo={community} />}
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
          ),
        }}
      />
      <View className=" m-auto  w-full flex-1 flex-col gap-7 p-5 pb-0 sm:w-full sm:max-w-screen-sm">
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

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M2.10347 8.88054C1.61698 8.39405 1.61698 7.60586 2.10347 7.11937L7.88572 1.33713C8.11914 1.10371 8.43573 0.972572 8.76583 0.972572C9.09594 0.972572 9.41252 1.10371 9.64594 1.33713C9.87936 1.57055 10.0105 1.88713 10.0105 2.21724C10.0105 2.54734 9.87936 2.86393 9.64594 3.09735L4.74334 7.99996L9.64594 12.9026C9.87936 13.136 10.0105 13.4526 10.0105 13.7827C10.0105 14.1128 9.87936 14.4294 9.64594 14.6628C9.41252 14.8962 9.09594 15.0273 8.76583 15.0273C8.43573 15.0273 8.11914 14.8962 7.88572 14.6628L2.10347 8.88054Z"
        fill="#fff"
      />
    </svg>
  );
}
