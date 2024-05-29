import { usePrivy } from "@privy-io/react-auth";
import {
  useGlobalSearchParams,
  useRouter,
  useSegments
} from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioContent } from "~/components/portfolio/PortfolioContent";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useAuth from "~/hooks/user/useAuth";

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
              <PortfolioContent fid={fid} defaultTab={segments?.[2]} />
            )
          ))}
      </View>
    </SafeAreaView>
  );
}
