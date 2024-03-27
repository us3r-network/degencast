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
    <View className="mt-12 flex h-full items-center justify-center">
      {ready &&
        (!authenticated ? (
          <Button className="rounded-lg px-6 py-3 text-white" onPress={login}>
            Log in
          </Button>
        ) : (
          <UserInfo />
        ))}
    </View>
  );
}
