import { FarcasterWithMetadata, usePrivy } from "~/lib/privy";

export default function useFarcasterAccount() {
  const { user, linkFarcaster, unlinkFarcaster } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;
  const signerPublicKey = farcasterAccount?.signerPublicKey;

  const currFid = user?.farcaster?.fid || undefined;

  return {
    farcasterAccount,
    signerPublicKey,
    currFid,
    linkFarcaster,
    unlinkFarcaster,
  };
}
