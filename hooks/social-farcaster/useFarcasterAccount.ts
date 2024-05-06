import { FarcasterWithMetadata, usePrivy } from "@privy-io/react-auth";

export default function useFarcasterAccount() {
  const { user } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;
  const signerPublicKey = farcasterAccount?.signerPublicKey || "";

  const currFid = user?.farcaster?.fid || "";

  return { farcasterAccount, signerPublicKey, currFid };
}
