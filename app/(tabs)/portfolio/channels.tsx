import { usePrivy } from "@privy-io/react-auth";
import { useLocalSearchParams } from "expo-router";
import ChannelList from "~/components/portfolio/channels/UserChannels";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function ChannelsScreen() {
  const params = useLocalSearchParams();
  const { user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = Number(params.fid || farcasterAccount?.fid || "0");
  console.log("ChannelsScreen", { fid, farcasterAccount });

  if (fid) {
    return <ChannelList fid={fid} />;
  } else if (!farcasterAccount) {
    return <LinkFarcaster />;
  }
}
