import { useEffect } from "react";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ApplyLaunchButton from "~/components/common/ApplyLaunchButton";
import { Loading } from "~/components/common/Loading";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import useUserHostChannels from "~/hooks/user/useUserHostChannels";

export default function ApplyLaunch({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { currFid } = useFarcasterAccount();
  const { channels, loading, done } = useUserHostChannels(currFid);

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
      <View className="max-w-screen-sm p-6">
        <View className="mb-8 flex flex-col items-center justify-center gap-8 pt-2">
          <Text className="text-3xl font-bold text-white">
            Hosting Channels
          </Text>
          <View>
            <Text className="text-center text-base font-bold text-secondary">
              Click the launch button to enable Contribution Token and other
              curation features.
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          className="max-h-[50vh]"
        >
          <View className="flex gap-5">
            {channels.map((channel) => {
              return <ChannelItem key={channel.id} channel={channel} />;
            })}
          </View>
        </ScrollView>
      </View>
      <View className="flex w-full items-center p-2">
        <Button
          variant={"secondary"}
          className="w-full"
          onPress={() => onComplete()}
        >
          <Text>Not now</Text>
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
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View className="flex flex-col justify-center">
          <Text className="text-base text-white">{channel.name}</Text>
          <Text className="text-xs text-secondary">{`/${channel.id}`}</Text>
        </View>
      </View>
      <View className="flex-grow"></View>
      <ApplyLaunchButton channelId={channel.id} />
    </View>
  );
}
