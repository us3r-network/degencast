import { CastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";

export default function MyCastsScreen() {
  const { currFid } = useFarcasterAccount();

  if (currFid) {
    return <CastList fid={currFid} />;
  } else {
    return <LinkFarcaster />;
  }
}
