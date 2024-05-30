import { useLocalSearchParams } from "expo-router";
import ChannelList from "~/components/portfolio/channels/UserChannels";

export default function ChannelsScreen() {
  const { fid } = useLocalSearchParams<{ fid: string }>();
  if (Number(fid)) {
    return <ChannelList fid={Number(fid)} />;
  }
}
