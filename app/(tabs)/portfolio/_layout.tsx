import { usePrivy } from "@privy-io/react-auth";
import {
  Stack,
  useFocusEffect,
  useGlobalSearchParams,
  useRouter,
  useSegments,
} from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";

const TABS = [
  { label: "Tokens", value: "tokens" },
  { label: "Channels", value: "channels" },
  { label: "Casts", value: "casts" },
];
export default function PortfolioScreen() {
  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const { ready, authenticated: privyAuthenticated } = usePrivy();
  const { authenticated } = useAuth();
  const router = useRouter();
  const login = () => {
    router.push("/login");
  };
  const params = useGlobalSearchParams();
  const fid = params.fid ? Number(params.fid) : undefined;
  const segments = useSegments();
  const defaultTab = segments?.[2] || TABS[0].value;
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <View className="mx-auto box-border w-full max-w-screen-sm flex-1 px-4">
        {ready &&
          (!privyAuthenticated ? (
            <Card className="flex h-full w-full items-center justify-center rounded-2xl">
              <Button onPress={login}>
                <Text>Log in</Text>
              </Button>
            </Card>
          ) : (
            authenticated && (
              <PortfolioContent fid={fid} defaultTab={defaultTab} />
            )
          ))}
      </View>
    </SafeAreaView>
  );
}

export function PortfolioContent({
  defaultTab,
  fid,
}: {
  defaultTab: string;
  fid?: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultTab);
  useFocusEffect(() => {
    setValue(defaultTab);
  });
  return (
    <View className="flex h-full w-full items-center gap-4 ">
      <View className="w-full h-24">
        <UserInfo fid={fid} />
      </View>
      <Tabs
        value={value}
        onValueChange={(value) => {
          const href = `./${value}` + (fid ? `?fid=${fid}` : "");
          router.navigate(href);
          setValue(value);
        }}
        className="relative box-border w-full flex-1"
      >
        {TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="absolute inset-0 top-8"
          >
            <Card className="h-full w-full p-2 pt-8 rounded-2xl">
              <CardContent className="native:gap-2 h-full gap-4 p-0 sm:p-4">
                <Stack
                  initialRouteName={tab.value}
                  screenOptions={{
                    header: () => null,
                    contentStyle: { backgroundColor: "white" },
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-2 top-2 flex-row rounded-full bg-white shadow-lg">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className={cn("flex-1 flex-row rounded-full")}
              value={tab.value}
            >
              <Text
                className={cn(
                  "font-medium text-primary",
                  value === tab.value && "text-primary-foreground",
                )}
              >
                {tab.label}
              </Text>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </View>
  );
}
