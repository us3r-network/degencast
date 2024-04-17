import { useState } from "react";
import { View } from "react-native";
import CommunityRank from "~/components/trade/CommunityRank";
import CommunityShares from "~/components/trade/CommunityShares";
import CommunityTokens from "~/components/trade/CommunityTokens";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const TABS = [
  { label: "Tokens", value: "tokens", content: <CommunityTokens /> },
  { label: "Shares", value: "shares", content: <CommunityShares /> },
  { label: "Rank", value: "rank", content: <CommunityRank /> },
];

export default function TradeScreen() {
  const [value, setValue] = useState("tokens");
  return (
    <View className="box-border w-full flex-1 bg-background p-4 pt-14 ">
      <Tabs
        value={value}
        onValueChange={setValue}
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
                {tab.content}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-8 top-2 flex-row rounded-full bg-white shadow-lg">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className={cn("flex-1 flex-row rounded-full")}
              value={tab.value}
            >
              <Text
                className={cn(
                  "font-bold text-primary",
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
