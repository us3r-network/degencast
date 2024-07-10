import {
  usePrivy,
  useLinkWithFarcaster,
  useUnlinkFarcaster,
} from "@privy-io/expo";

export default function useFarcasterAccount() {
  const { user } = usePrivy();
  const farcasterFlow = useLinkWithFarcaster();
  const { unlinkFarcaster } = useUnlinkFarcaster();
  const farcasterAccount = user?.linked_accounts.find(
    (account) => account.type === "farcaster",
  );
  const signerPublicKey = farcasterAccount?.signer_public_key;

  const currFid = farcasterAccount?.fid || undefined;

  return {
    farcasterAccount,
    signerPublicKey,
    currFid,
    linkFarcaster: farcasterFlow.linkWithFarcaster,
    unlinkFarcaster,
  };
}
