import { usePrivy } from "@privy-io/react-auth";
import { useLocalSearchParams } from "expo-router";
import ChannelList from "~/components/portfolio/channels/UserChannels";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function MyChannelsScreen() {
  const { user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);

  if (farcasterAccount?.fid) {
    return <ChannelList fid={farcasterAccount?.fid} />;
  } else if (!farcasterAccount) {
    return <LinkFarcaster />;
  }
}
