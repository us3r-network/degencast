import {
  FarcasterWithMetadata,
  User,
  useCreateWallet,
  useExperimentalFarcasterSigner,
  useLinkAccount,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import {
  ExternalEd25519Signer
} from "@standard-crypto/farcaster-js-hub-rest";
import { useCallback, useMemo, useState } from "react";
import { UserActionName } from "~/services/user/types";
import useUserAction from "../user/useUserAction";

export default function useFarcasterSigner() {
  const { submitUserAction } = useUserAction();

  const { user } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

  const { createWallet } = useCreateWallet();
  const { wallets } = useWallets();
  const embededWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded",
  );

  const linkFarcasterHanler = {
    onSuccess: (user: User) => {
      console.log("Linked farcaster account", user);
      prepareWrite();
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
    },
  };
  const { linkFarcaster } = useLinkAccount(linkFarcasterHanler);

  const {
    requestFarcasterSignerFromWarpcast,
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
  } = useExperimentalFarcasterSigner();

  const privySigner = useMemo(
    () =>
      new ExternalEd25519Signer(
        signFarcasterMessage,
        getFarcasterSignerPublicKey,
      ),
    [getFarcasterSignerPublicKey, signFarcasterMessage],
  );



  const [prepareing, setPrepareing] = useState(false);
  const prepareWrite = async () => {
    setPrepareing(true);
    if (!embededWallet) {
      console.log("Creating embeded wallet");
      await createWallet();
    }
    if (!farcasterAccount) {
      console.log("Linking farcaster");
      await linkFarcaster(); // this does not mean linking is done, it just starts the process, the user will have to confirm the linking, then the onSuccess callback will be called
      return false;
    } else {
      if (!farcasterAccount?.signerPublicKey) {
        console.log("Requesting farcaster signer");
        await requestFarcasterSignerFromWarpcast(); // todo: this should be done in the background, and a onSuccess callback should be called after the signer is ready
        submitUserAction({
          action: UserActionName.ConnectFarcaster,
        });
        return false;
      }
    }
    setPrepareing(false);
    return true;
  };

  const getPrivySigner = useCallback(async () => {
    const ready = await prepareWrite();
    if (!ready) return;
    return privySigner;
  }, [privySigner, prepareWrite]);

  return {
    prepareWrite,
    prepareing,
    getPrivySigner,
  };
}
