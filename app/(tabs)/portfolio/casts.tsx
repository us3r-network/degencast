import { usePrivy } from "@privy-io/react-auth";
import { useLocalSearchParams } from "expo-router";
import { CastList } from "~/components/portfolio/posts/UserCasts";
import { LinkFarcaster } from "~/components/portfolio/user/LinkFarster";
import { getUserFarcasterAccount } from "~/utils/privy";

export default function CastsScreen() {
  const params = useLocalSearchParams();
  const { user } = usePrivy();
  const farcasterAccount = getUserFarcasterAccount(user);
  const fid = params.fid || farcasterAccount?.fid;

  if (fid) {
    return <CastList fid={Number(fid)} />;
  } else if (!farcasterAccount) {
    return <LinkFarcaster />;
  }
}
