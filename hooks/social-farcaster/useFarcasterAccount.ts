import { FarcasterWithMetadata, usePrivy } from "@privy-io/react-auth";

export default function useFarcasterAccount() {
  const { user } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;
  const signerPublicKey = farcasterAccount?.signerPublicKey || "";
  return { farcasterAccount, signerPublicKey };
}
