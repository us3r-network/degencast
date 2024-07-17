import { CastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import { PortfolioPageContent } from ".";

export default function MyCastsScreen() {
  const { currFid } = useFarcasterAccount();
  return (
    <PortfolioPageContent>
      {currFid ? <CastList fid={currFid} /> : <LinkFarcaster />}
    </PortfolioPageContent>
  );
}
