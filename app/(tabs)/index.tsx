import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useSegments,
  useNavigation,
  useGlobalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import FollowingScreen from "~/components/explore/following";
import HostingScreen from "~/components/explore/hosting";
import TrendingScreen from "~/components/explore/trending";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { cn } from "~/lib/utils";

const initialRouteName = "trending";

const TABS = [
  { label: "Trending", value: "trending", screenComponent: <TrendingScreen /> },
  {
    label: "Following",
    value: "following",
    screenComponent: <FollowingScreen />,
  },
  { label: "Hosting", value: "hosting", screenComponent: <HostingScreen /> },
];

export default function ExploreLayout() {
  const { currFid } = useFarcasterAccount();
  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const globalParams = useGlobalSearchParams<{ tab?: string }>();
  const { tab } = globalParams || {};
  const [activeScreen, setActiveScreen] = useState(initialRouteName);
  useEffect(() => {
    if (tab) {
      setActiveScreen(tab);
    }
  }, [tab]);
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <View className=" m-auto w-full flex-1 max-sm:px-4 sm:w-full sm:max-w-screen-sm">
        <Tabs
          value={activeScreen}
          onValueChange={(value) => {
            setActiveScreen(value);
          }}
          className="flex h-full w-full flex-col gap-4"
        >
          <TabsList className="m-0 h-auto flex-row justify-start gap-[30px] p-0">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="m-0 h-auto p-0"
              >
                <Text
                  className={cn(
                    "text-base font-bold leading-[20px] text-secondary",
                    activeScreen === tab.value && " text-secondary-foreground",
                  )}
                >
                  {tab.label}
                </Text>
              </TabsTrigger>
            ))}
          </TabsList>
          <View className="w-full flex-1">
            {TABS.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="h-full w-full"
              >
                {tab.screenComponent}
              </TabsContent>
            ))}
          </View>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
