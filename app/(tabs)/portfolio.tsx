import { usePrivy } from "@privy-io/react-auth";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import UserInfo from "~/components/portfolio/user/UserInfo";
import UserPosts from "~/components/portfolio/posts/UserCasts";
import UserTokens from "~/components/portfolio/tokens/UserTokens";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useAuth from "~/hooks/user/useAuth";
import { cn } from "~/lib/utils";

const TABS = [
  { label: "Tokens", value: "tokens", content: <UserTokens /> },
  { label: "Casts", value: "casts", content: <UserPosts /> },
];
export default function PortfolioScreen() {
  const { login, ready, authenticated: privyAuthenticated } = usePrivy();
  const { authenticated } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (ready && !privyAuthenticated) {
        login();
      }
    }, []),
  );

  const [value, setValue] = useState("tokens");
  return (
    <View className="box-border w-full flex-1 bg-primary p-4 pt-16">
      {ready &&
        (!privyAuthenticated ? (
          <Card className="mx-auto flex h-full w-full max-w-screen-sm items-center justify-center">
            <Button className="rounded-lg bg-primary px-6 py-3" onPress={login}>
              <Text className="text-primary-foreground">Log in</Text>
            </Button>
          </Card>
        ) : (
          authenticated && (
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
                      <CardContent className="native:gap-2 h-full gap-4">
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
          )
        ))}
    </View>
  );
}
