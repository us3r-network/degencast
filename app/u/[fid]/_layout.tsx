import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useSegments,
} from "expo-router";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Header,
  HeaderLeft,
  HeaderRight,
} from "~/components/layout/header/Header";
import {
  ExploreSharingButton,
  PortfolioSharingButton,
} from "~/components/platform-sharing/PlatformSharingButton";
import { PortfolioContent } from "~/components/portfolio/PortfolioContent";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";
import useUserBulk from "~/hooks/user/useUserBulk";

export default function UserPortfolioScreen() {
  const { fid } = useLocalSearchParams<{ fid: string }>();
  const { items: userItems, load } = useUserBulk();

  useEffect(() => {
    if (Number(fid)) load(Number(fid));
  }, [fid]);

  const username = useMemo(() => {
    if (!userItems || userItems.length === 0) return undefined;
    const user = userItems[0];
    if (user?.username) return user.username;
    return "User Portfolio";
  }, [userItems]);

  const segments = useSegments();
  if (Number(fid))
    return (
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: DEFAULT_HEADER_HEIGHT + 20,
          paddingBottom: 20,
        }}
        className="flex-1 bg-background p-2"
      >
        <Stack.Screen
          options={{
            headerTransparent: true,
            header: () => (
              <Header>
                <HeaderLeft title={username || "User Portfolio"} />
                <HeaderRight>
                  <View>
                    {fid && <PortfolioSharingButton fid={Number(fid)} />}
                  </View>
                </HeaderRight>
              </Header>
            ),
          }}
        />
        <View className="mx-auto box-border w-full max-w-screen-sm flex-1 px-4">
          <PortfolioContent fid={Number(fid)} defaultTab={segments?.[2]} />
        </View>
      </SafeAreaView>
    );
}
