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
          className="h-full w-full"
        >
          <View className="absolute left-1/2 top-0 z-10 box-border w-full -translate-x-1/2 px-4">
            <TabsList className="flex-row rounded-full bg-white shadow-lg">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className={cn("flex-1 flex-row rounded-full")}
                  value={tab.value}
                >
                  <Text
                    className={cn(
                      "whitespace-nowrap font-medium text-primary",
                      activeScreen === tab.value && "text-primary-foreground",
                    )}
                  >
                    {tab.label}
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </View>
          {TABS.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="h-full w-full pt-5"
            >
              <Card className="box-border h-full w-full overflow-hidden rounded-[20px] border-none">
                {tab.screenComponent}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
