import { FarcasterWithMetadata, usePrivy } from "@privy-io/react-auth";

export default function useFarcasterAccount() {
  const { user, linkFarcaster, unlinkFarcaster } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;
  const signerPublicKey = farcasterAccount?.signerPublicKey;

  const currFid = farcasterAccount?.fid || undefined;

  return {
    farcasterAccount,
    signerPublicKey,
    currFid,
    linkFarcaster,
    unlinkFarcaster,
  };
}
