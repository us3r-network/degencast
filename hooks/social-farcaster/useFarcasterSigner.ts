import {
  User,
  useCreateWallet,
  useFarcasterSigner as usePrivyFarcasterSigner,
  useLinkAccount,
  useWallets
} from "@privy-io/react-auth";
import { ExternalEd25519Signer } from "@standard-crypto/farcaster-js-hub-rest";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserActionName } from "~/services/user/types";
import useUserAction from "../user/useUserAction";
import useFarcasterAccount from "./useFarcasterAccount";

export default function useFarcasterSigner() {
  const { submitUserAction } = useUserAction();

  const { farcasterAccount, signerPublicKey } = useFarcasterAccount();

  const { createWallet } = useCreateWallet();
  const { wallets } = useWallets();
  const embededWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded",
  );

  const linkFarcasterHanler = {
    onSuccess: (user: User) => {
      console.log("Linked farcaster account", user);
      setLinkingFarcaster(false);
      if (!requestingSigner) requestSigner();
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
      setLinkingFarcaster(false);
    },
  };
  const { linkFarcaster } = useLinkAccount(linkFarcasterHanler);

  const {
    requestFarcasterSignerFromWarpcast,
    getFarcasterSignerPublicKey,
    signFarcasterMessage,
  } = usePrivyFarcasterSigner();

  const [hasSigner, setHasSigner] = useState(
    !!signerPublicKey,
  );
  useEffect(() => {
    if (signerPublicKey && !hasSigner) {
      setHasSigner(true);
      if (requestingSigner) {
        setRequestingSigner(false);
        submitUserAction({
          action: UserActionName.ConnectFarcaster,
          data: { signerPublicKey},
        });
      }
    }
  }, [signerPublicKey]);

  const privySigner = useMemo(
    () =>
      new ExternalEd25519Signer(
        signFarcasterMessage,
        getFarcasterSignerPublicKey,
      ),
    [getFarcasterSignerPublicKey, signFarcasterMessage],
  );

  const [linkingFarcaster, setLinkingFarcaster] = useState(false);
  const [requestingSigner, setRequestingSigner] = useState(false);
  const requestSigner = async () => {
    if (linkingFarcaster || requestingSigner) return;
    if (!embededWallet) {
      console.log("Creating embeded wallet");
      await createWallet();
    }
    if (!farcasterAccount) {
      console.log("Linking farcaster");
      setLinkingFarcaster(true);
      linkFarcaster(); // this does not mean linking is done, it just starts the process, the user will have to confirm the linking, then the onSuccess callback will be called
    } else {
      if (!signerPublicKey) {
        console.log("Requesting farcaster signer");
        try {
          // todo: this should be done in the background, and a onSuccess callback should be called after the signer is ready
          setRequestingSigner(true);
          requestFarcasterSignerFromWarpcast();
          setTimeout(() => {
            setRequestingSigner(false);
          }, 5000);
        } catch (error) {
          console.log("requestFarcasterSignerFromWarpcast Error: ", error);
          setRequestingSigner(false);
        }
      }
    }
  };

  const getPrivySigner = useCallback(async () => {
    if (hasSigner) {
      return privySigner;
    }
  }, [privySigner]);

  return {
    hasSigner,
    requestSigner,
    requesting: linkingFarcaster || requestingSigner,
    getPrivySigner,
  };
}
