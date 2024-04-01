import { usePrivy } from "@privy-io/react-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import UserInfo from "~/components/portfolio/UserInfo";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import UserPosts from "~/components/portfolio/UserPosts";
import UserTokens from "~/components/portfolio/UserTokens";

const TABS = [
  { label: "Tokens", value: "tokens", content: <UserTokens /> },
  { label: "Posts", value: "posts", content: <UserPosts /> },
];
export default function PortfolioScreen() {
  const { login, ready, authenticated } = usePrivy();

  useFocusEffect(
    useCallback(() => {
      if (ready && !authenticated) {
        login();
      }
    }, []),
  );

  const [value, setValue] = useState("tokens");
  return (
    <View className="box-border w-full flex-1 bg-primary p-4">
      {ready &&
        (!authenticated ? (
          <Card className="mx-auto flex h-full w-full max-w-screen-sm items-center justify-center">
            <Button className="rounded-lg bg-primary px-6 py-3" onPress={login}>
              <Text className="text-primary-foreground">Log in</Text>
            </Button>
          </Card>
        ) : (
          <View className="mx-auto flex h-full w-full max-w-screen-sm items-center gap-4 ">
            <UserInfo />
            <Tabs
              value={value}
              onValueChange={setValue}
              className="relative box-border w-full flex-1"
            >
              {TABS.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="absolute inset-0 top-8"
                >
                  <Card className="h-full w-full p-2 pt-8">
                    <CardContent className="native:gap-2 gap-4">
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
        ))}
    </View>
  );
}
