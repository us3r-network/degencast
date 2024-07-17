import ChannelList from "~/components/portfolio/channels/UserChannels";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { PortfolioPageContent } from ".";

export default function MyChannelsScreen() {
  const { currFid } = useFarcasterAccount();
  return (
    <PortfolioPageContent>
      {currFid ? <ChannelList fid={currFid} /> : <LinkFarcaster />}
    </PortfolioPageContent>
  );
}
