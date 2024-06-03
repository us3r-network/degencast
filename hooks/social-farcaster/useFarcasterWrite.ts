import {
  FarcasterWithMetadata,
  User,
  useCreateWallet,
  useExperimentalFarcasterSigner,
  useLinkAccount,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useCallback, useMemo, useState } from "react";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";
import {
  ExternalEd25519Signer,
  HubRestAPIClient,
} from "@standard-crypto/farcaster-js-hub-rest";
import axios from "axios";
import { FARCASTER_HUB_URL, NEYNAR_API_KEY } from "~/constants/farcaster";

const hubClient = new HubRestAPIClient({
  hubUrl: FARCASTER_HUB_URL,
  axiosInstance: axios.create({
    headers: { api_key: NEYNAR_API_KEY },
  }),
});

export type SubmitCastBody = {
  mentions?: number[] | undefined;
  parentCastId?:
    | {
        fid: number;
        hash: string;
      }
    | undefined;
  parentUrl?: string | undefined;
  text: string;
  mentionsPositions?: number[] | undefined;
  embeds?:
    | {
        url?: string | undefined;
        castId?:
          | {
              fid: number;
              hash: string;
            }
          | undefined;
      }[]
    | undefined;
};

export type ReplyCastRes = Promise<
  | {
      text: string;
      embeds: {
        url: string | undefined;
      }[];
      parentCastId:
        | {
            fid: number;
            hash: string;
          }
        | undefined;
      hash: string;
    }
  | undefined
>;

export default function useFarcasterWrite() {
  const { submitUserAction } = useUserAction();
  const { user } = usePrivy();

  const { createWallet } = useCreateWallet();
  const { wallets } = useWallets();
  const embededWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded",
  );

  const linkHanler = {
    onSuccess: (user: User) => {
      console.log("Linked farcaster account", user);
      prepareWrite();
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
    },
  };
  const { linkFarcaster } = useLinkAccount(linkHanler);

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

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

  const [prepareing, setPrepareing] = useState(false);
  const [writing, setWriting] = useState(false);
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

  const submitCast = useCallback(
    async (data: SubmitCastBody) => {
      const ready = await prepareWrite();
      if (!ready) return;
      try {
        setWriting(true);
        const result = await hubClient.submitCast(
          {
            text: data.text,
            embeds: data.embeds?.map((embed) => ({
              url: embed.url,
            })),
            parentUrl: data.parentUrl,
            parentCastId: data.parentCastId,
          },
          farcasterAccount.fid!,
          privySigner,
        );
        return result;
      } catch (e) {
        console.error(e);
      } finally {
        setWriting(false);
      }
    },
    [privySigner, farcasterAccount, prepareWrite],
  );

  const removeCast = useCallback(
    async (castHash: string) => {
      const ready = await prepareWrite();
      if (!ready) return;
      try {
        const result = await hubClient.removeCast(
          castHash,
          farcasterAccount.fid!,
          privySigner,
        );
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    [privySigner, farcasterAccount, prepareWrite],
  );

  const reactionCast = useCallback(
    async (
      type: "like" | "recast",
      castHash: string,
      castAuthorFid: number,
    ) => {
      const ready = await prepareWrite();
      if (!ready) return;
      try {
        const result = await hubClient.submitReaction(
          {
            type,
            target: {
              fid: castAuthorFid,
              hash: castHash,
            },
          },
          farcasterAccount.fid!,
          privySigner,
        );
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    [privySigner, farcasterAccount, prepareWrite],
  );

  const likeCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return reactionCast("like", castHash, castAuthorFid);
    },
    [reactionCast],
  );
  const recastCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return reactionCast("recast", castHash, castAuthorFid);
    },
    [reactionCast],
  );

  const followUser = useCallback(
    async (fid: number) => {
      const ready = await prepareWrite();
      if (!ready) return;
      try {
        const result = await hubClient.followUser(
          fid,
          farcasterAccount.fid!,
          privySigner,
        );
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    [privySigner, farcasterAccount, prepareWrite],
  );

  const unfollowUser = useCallback(
    async (fid: number) => {
      const ready = await prepareWrite();
      if (!ready) return;
      try {
        const result = await hubClient.unfollowUser(
          fid,
          farcasterAccount.fid!,
          privySigner,
        );
        return result;
      } catch (e) {
        console.error(e);
      }
    },
    [privySigner, farcasterAccount, prepareWrite],
  );

  const getPrivySigner = useCallback(async () => {
    const ready = await prepareWrite();
    if (!ready) return;
    return privySigner;
  }, [privySigner, prepareWrite]);

  return {
    prepareWrite,
    writing: writing || prepareing,
    prepareing,
    submitCast,
    replayCast: submitCast,
    submitCastWithOpts: submitCast,
    removeCast: removeCast,
    likeCast: likeCast,
    recastCast: recastCast,
    followUser: followUser,
    unfollowUser: unfollowUser,
    getPrivySigner,
  };
}
