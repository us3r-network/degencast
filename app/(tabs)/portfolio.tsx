import { usePrivy } from "@privy-io/react-auth";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import UserInfo from "~/components/portfolio/UserInfo";
import { Button } from "~/components/ui/button";

export default function PortfolioScreen() {
  const { login, ready, authenticated } = usePrivy();

  useFocusEffect(
    useCallback(() => {
      if (ready && !authenticated) {
        login();
      }
    }, [])
  );

  return (
    <View className="w-full h-full bg-primary">
      {ready &&
        (!authenticated ? (
          <Button className="rounded-lg px-6 py-3" onPress={login}>
            <Text className="text-white">Log in</Text>
          </Button>
        ) : (
          <View className="w-screen-sm m-auto mt-2 p-3 space-y-2 flex items-center">
            <UserInfo />
          </View>
        ))}
    </View>
  );
}
