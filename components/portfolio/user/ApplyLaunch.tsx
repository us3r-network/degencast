import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ApplyLaunchButton from "~/components/common/ApplyLaunchButton";
import { Loading } from "~/components/common/Loading";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";

export default function ApplyLaunch({ onComplete }: { onComplete: () => void }) {
  const { user } = usePrivy();
  const { channels, loading, done } = useUserHostChannels(
    user?.farcaster?.fid || undefined,
  );

  useEffect(() => {
    if (done && channels.length === 0) {
      onComplete();
    }
  }, [done, channels, onComplete]);

  if (loading) {
    return <Loading />;
  }
  return (
    <View className="relative flex h-full w-full  flex-col items-center justify-center ">
      <ScrollView className="flex h-full w-full items-center ">
        <View className="max-w-screen-sm p-6">
          <View className="mb-8 flex flex-col items-center justify-center gap-8 pt-2">
            <Text className="text-3xl font-bold text-white">
              Hosting Channels
            </Text>
            <View>
              <Text className="text-center text-base font-bold text-secondary">
                Degencast is releasing Channel Share and Token Launch features
                soon.
              </Text>
              <Text className="text-center text-base font-bold text-secondary">
                Please apply in advance.
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-5">
            {channels.map((channel) => {
              return <ChannelItem key={channel.id} channel={channel} />;
            })}
          </View>
        </View>
      </ScrollView>
      <View className="flex-grow" />
      <View className="flex w-full items-center p-2">
        <Button className="h-14 w-80" onPress={() => onComplete()}>
          <Text className="text-secondary">Not now</Text>
        </Button>
      </View>
    </View>
  );
}

function ChannelItem({
  channel,
}: {
  channel: {
    id: string;
    name: string;
    imageUrl: string;
  };
}) {
  return (
    <View className="flex flex-row items-center">
      <View className="flex flex-row gap-2">
        <Image
          source={{ uri: channel.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View className="flex flex-col justify-center">
          <Text className="text-xl text-white">{channel.name}</Text>
          <Text className="text-base text-secondary">{`/${channel.id}`}</Text>
        </View>
      </View>
      <View className="flex-grow"></View>
      <ApplyLaunchButton channelId={channel.id} />
    </View>
  );
}
