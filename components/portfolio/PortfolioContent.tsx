import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import UserInfo from "~/components/portfolio/user/UserInfo";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const TABS = [
  { label: "Tokens", value: "tokens" },
  { label: "Channels", value: "channels" },
  { label: "Casts", value: "casts" },
];

export function PortfolioContent({
  defaultTab,
  fid,
}: {
  defaultTab?: string;
  fid?: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultTab || TABS[0].value);
  useEffect(() => {
    if (defaultTab) {
      setValue(defaultTab);
    }
  }, [defaultTab]);

  return (
    <View className="flex h-full w-full items-center gap-4 ">
      <View className="h-24 w-full">
        <UserInfo fid={fid} />
      </View>
      <Tabs
        value={value}
        onValueChange={(value) => {
          const href = `./${value}`;
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
            <Card className="h-full w-full rounded-2xl p-2 pt-8">
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
