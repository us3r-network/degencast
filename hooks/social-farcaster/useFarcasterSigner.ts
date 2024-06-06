import {
  FarcasterWithMetadata,
  User,
  useCreateWallet,
  useExperimentalFarcasterSigner,
  useLinkAccount,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { ExternalEd25519Signer } from "@standard-crypto/farcaster-js-hub-rest";
import { useCallback, useEffect, useMemo, useState } from "react";
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
      requestSigner();
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

  const [hasSigner, setHasSigner] = useState(false);
  useEffect(() => {
    if (farcasterAccount) {
      if (farcasterAccount.signerPublicKey) {
        setHasSigner(true);
      }
    }
  }, [farcasterAccount]);

  const privySigner = useMemo(
    () =>
      new ExternalEd25519Signer(
        signFarcasterMessage,
        getFarcasterSignerPublicKey,
      ),
    [getFarcasterSignerPublicKey, signFarcasterMessage],
  );

  const [requesting, setRequesting] = useState(false);
  const requestSigner = async () => {
    setRequesting(true);
    if (!embededWallet) {
      console.log("Creating embeded wallet");
      await createWallet();
    }
    if (!farcasterAccount) {
      console.log("Linking farcaster");
      await linkFarcaster(); // this does not mean linking is done, it just starts the process, the user will have to confirm the linking, then the onSuccess callback will be called
    } else {
      if (!farcasterAccount?.signerPublicKey) {
        console.log("Requesting farcaster signer");
        try {
          // todo: this should be done in the background, and a onSuccess callback should be called after the signer is ready
          await requestFarcasterSignerFromWarpcast();
        } catch (error) {
          console.log("requestFarcasterSignerFromWarpcast Error: ", error);
        }
        submitUserAction({
          action: UserActionName.ConnectFarcaster,
        });
      }
    }
    setRequesting(false);
  };

  const getPrivySigner = useCallback(async () => {
    if (await hasSigner) {
      return privySigner;
    }
  }, [privySigner]);

  return {
    hasSigner,
    requestSigner,
    requesting,
    getPrivySigner,
  };
}
