import { useLocalSearchParams, useSegments } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioContent } from "~/components/portfolio/PortfolioContent";
import { DEFAULT_HEADER_HEIGHT } from "~/constants";

export default function UserPortfolioScreen() {
  const { fid } = useLocalSearchParams<{ fid: string }>();
  const segments = useSegments();
  if (Number(fid))
    return (
      <SafeAreaView
        style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}
        className="flex-1 bg-background p-2"
      >
        <View className="mx-auto box-border w-full max-w-screen-sm flex-1 px-4">
          <PortfolioContent fid={Number(fid)} defaultTab={segments?.[2]} />
        </View>
      </SafeAreaView>
    );
}
