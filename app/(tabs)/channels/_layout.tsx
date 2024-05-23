import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useFocusEffect, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import { cn } from "~/lib/utils";

const TABS = [
  { label: "Tokens(USD)", value: "tokens" },
  // { label: "Shares", value: "shares" },
  { label: "Rank(Casts)", value: "rank" },
];

export default function TradeScreen() {
  const headerHeight = useHeaderHeight() || DEFAULT_HEADER_HEIGHT;
  const segments = useSegments();
  const [value, setValue] = useState(segments[2] || TABS[0].value);
  const router = useRouter();
  useFocusEffect(() => {
    if (segments?.[2]) {
      setValue(segments[2]);
    } else if (!value) {
      setValue(TABS[0].value);
    }
  });
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: headerHeight }}
      className="bg-background"
    >
      <View className="box-border w-full flex-1 px-4 ">
        <Tabs
          value={value}
          onValueChange={(value) => {
            router.navigate(`./${value}`);
            setValue(value);
          }}
          className="relative mx-auto box-border w-full max-w-screen-sm flex-1"
        >
          {TABS.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="absolute inset-0 top-8"
            >
              <Card className="h-full w-full p-2 pt-8">
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
    </SafeAreaView>
  );
}
