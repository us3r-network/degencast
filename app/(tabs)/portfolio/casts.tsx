import { usePrivy } from "@privy-io/react-auth";
import { CastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function MyCastsScreen() {
  const { user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);

  if (farcasterAccount?.fid) {
    return <CastList fid={farcasterAccount?.fid} />;
  } else if (!farcasterAccount) {
    return <LinkFarcaster />;
  }
}
