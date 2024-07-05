import ChannelList from "~/components/portfolio/channels/UserChannels";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

export default function MyChannelsScreen() {
  const { currFid } = useFarcasterAccount();

  if (currFid) {
    return <ChannelList fid={currFid} />;
  } else {
    return <LinkFarcaster />;
  }
}
