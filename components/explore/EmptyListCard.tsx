import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "../ui/text";
import { ExploreCard } from "./ExploreStyled";
import { Button } from "../ui/button";
import useAppSettings from "~/hooks/useAppSettings";
import { ExploreActivatedViewName } from "~/features/appSettingsSlice";
export function FollowingEmptyListCard() {
  const { setExploreActivatedViewName } = useAppSettings();
  return (
    <ExploreCard>
      <View className="flex h-full w-full flex-col items-center justify-center ">
        <View className="flex h-full w-72 flex-col items-center justify-center gap-8 max-sm:gap-3">
          <Image
            source={require("~/assets/images/default-search.png")}
            contentFit="fill"
            style={{ width: 280, height: 280 }}
          />

          <Text className=" text-xl font-bold text-primary">No Channels</Text>
          <Text className="text-center text-base leading-8 text-secondary">
            You haven't followed any channels {`\n`}
            yet, go explore trends.
          </Text>

          <Button
            className="w-72 rounded-md bg-secondary"
            onPress={() => {
              setExploreActivatedViewName(ExploreActivatedViewName.trending);
            }}
          >
            <Text className=" text-base">Explore</Text>
          </Button>
        </View>
      </View>
    </ExploreCard>
  );
}

export function HostingEmptyListCard() {
  return (
    <ExploreCard>
      <View className="flex h-full w-full flex-col items-center justify-center ">
        <View className="flex h-full w-72 flex-col items-center justify-center gap-8 max-sm:gap-3">
          <Image
            source={require("~/assets/images/default-search.png")}
            contentFit="fill"
            style={{ width: 280, height: 280 }}
          />

          <Text className="text-xl font-bold text-primary">No Channels</Text>
          <Text className="text-center text-base leading-8 text-secondary">
            You are not the host of any channel,{`\n`}
            please go to Warpcast to create {`\n`}
            your channel. {`\n`}
            Create channels in Degencast is{`\n`}
            coming soon.
          </Text>
        </View>
      </View>
    </ExploreCard>
  );
}
