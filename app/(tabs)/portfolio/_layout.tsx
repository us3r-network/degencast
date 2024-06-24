import { User, usePrivy } from "@privy-io/react-auth";
import { useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioContent } from "~/components/portfolio/PortfolioContent";
import UserSignin from "~/components/portfolio/user/UserSignin";
import { Card } from "~/components/ui/card";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useAuth from "~/hooks/user/useAuth";

export default function PortfolioScreen() {
  const { ready } = usePrivy();
  const { authenticated } = useAuth();
  const segments = useSegments();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: DEFAULT_HEADER_HEIGHT }}
      className="bg-background"
    >
      <View className="box-border w-full flex-1 px-4">
        <View className="relative mx-auto box-border w-full max-w-screen-sm flex-1">
          {ready &&
            (!authenticated ? (
              <Card className="flex h-full w-full items-center justify-center rounded-2xl">
                <UserSignin
                  showCancelButton
                  onSuccess={() => {
                    console.log("login successful!");
                  }}
                  onFail={(error: unknown) => {
                    console.log("Failed to login", error);
                  }}
                />
              </Card>
            ) : (
              <PortfolioContent defaultTab={segments?.[2]} />
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
