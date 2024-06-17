import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import FollowingScreen from "~/components/explore/following";
import HostingScreen from "~/components/explore/hosting";
import TrendingScreen from "~/components/explore/trending";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";
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
const itemPaddingTop = 15;

export default function ExploreLayout() {
  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const globalParams = useGlobalSearchParams<{ tab?: string }>();
  const { tab } = globalParams || {};
  const [activeScreen, setActiveScreen] = useState(initialRouteName);
  useEffect(() => {
    if (tab) {
      setActiveScreen(tab);
    }
  }, [tab]);
  const { authenticated, login } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { requestSigner, hasSigner } = useFarcasterSigner();
  const { channels } = useUserHostChannels(Number(currFid));
  const showHosting =
    authenticated && currFid && hasSigner && channels.length > 0;
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
          className="flex h-full w-full flex-col"
        >
          <TabsList className="m-0 h-auto flex-row justify-start gap-[30px] p-0">
            {TABS.map((tab) => {
              if (tab.value === "hosting" && !showHosting) {
                return null;
              }
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="m-0 h-auto p-0"
                >
                  <Text
                    className={cn(
                      "text-base font-bold leading-[20px] text-secondary",
                      activeScreen === tab.value &&
                        " text-secondary-foreground",
                    )}
                  >
                    {tab.label}
                  </Text>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <View className="w-full flex-1">
            {TABS.map((tab) => {
              if (tab.value === "hosting" && !showHosting) {
                return null;
              }
              if (
                tab.value === "following" &&
                (!authenticated || !currFid || !hasSigner)
              ) {
                return (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="h-full w-full"
                  >
                    <View
                      className="h-full w-full"
                      style={{
                        paddingTop: itemPaddingTop,
                      }}
                    >
                      <Card className="box-border h-full w-full flex-col items-center justify-center gap-4 rounded-[20px] border-none">
                        <Button
                          className="rounded-lg bg-primary"
                          onPress={() => {
                            if (!authenticated) {
                              login();
                              return;
                            }
                            if (!currFid || !hasSigner) {
                              requestSigner();
                              return;
                            }
                          }}
                        >
                          <Text className="text-primary-foreground">
                            {(() => {
                              if (!authenticated) {
                                return "Log in";
                              }
                              if (!currFid || !hasSigner) {
                                return "Link Farcaster";
                              }
                            })()}
                          </Text>
                        </Button>
                      </Card>
                    </View>
                  </TabsContent>
                );
              }
              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="h-full w-full"
                >
                  {tab.screenComponent}
                </TabsContent>
              );
            })}
          </View>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
