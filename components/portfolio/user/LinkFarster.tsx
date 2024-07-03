import { usePrivy } from "@privy-io/react-auth";
import { Image } from "expo-image";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useAuth from "~/hooks/user/useAuth";

export function LinkFarcaster() {
  const { linkFarcaster } = usePrivy();
  const { ready, authenticated } = useAuth();
  if (ready && authenticated) {
    return (
      <View className="flex-1 items-center justify-center gap-6">
        <Image
          source={require("~/assets/images/no-fid.png")}
          className="h-72 w-72"
          contentFit="fill"
          style={{ width: 280, height: 280 }}
        />
        <Text className="text-lg font-bold text-primary">
          Login with Farcaster Only
        </Text>
        <Text className="text-md text-secondary">
          Please connect Farcaster to display & create your casts
        </Text>
        <Button
          className="flex-row items-center justify-between gap-2"
          onPress={linkFarcaster}
        >
          <Image
            source={require("~/assets/images/farcaster.png")}
            style={{ width: 16, height: 16 }}
          />
          <Text>Link Farcaster</Text>
        </Button>
      </View>
    );
  }
}
