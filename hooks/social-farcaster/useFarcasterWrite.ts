import {
  FarcasterWithMetadata,
  useCreateWallet,
  useExperimentalFarcasterSigner,
  useLinkAccount,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useState } from "react";
import useUserAction from "../user/useUserAction";
import { UserActionName } from "~/services/user/types";

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
    onSuccess: (user: unknown) => {
      console.log("Linked farcaster account", user);
      prepareWrite();
    },
    onError: (error: unknown) => {
      console.error("Failed to link farcaster account", error);
    },
  };
  const { linkFarcaster } = useLinkAccount(linkHanler);

  const {
    submitCast,
    removeCast,
    likeCast,
    recastCast,
    followUser,
    unfollowUser,
    requestFarcasterSigner,
  } = useExperimentalFarcasterSigner();
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
        await requestFarcasterSigner(); // todo: this should be done in the background, and a onSuccess callback should be called after the signer is ready
        submitUserAction({
          action: UserActionName.ConnectFarcaster,
        });
        return false;
      }
    }
    setPrepareing(false);
    return true;
  };
  return {
    prepareWrite,
    writing: writing && prepareing,
    // todo: add more post support!
    submitCast: async ({
      text,
      embeds,
      channel,
    }: {
      text: string;
      embeds: {
        url?: string | undefined;
        castId?:
          | {
              fid: number;
              hash: string;
            }
          | undefined;
      }[];
      channel: string;
    }) => {
      const canWrite = await prepareWrite();
      if (canWrite) {
        setWriting(true);
        const data = {
          text,
          embeds: embeds.length
            ? embeds.map((embed) => ({
                url: embed.url,
              }))
            : undefined,
          parentUrl: channel || undefined,
        };
        const result = await submitCast(data);
        setWriting(false);
        return result;
      }
    },
    replayCast: async ({
      text,
      embeds,
      parentCastId,
    }: {
      text: string;
      embeds: {
        url?: string | undefined;
        castId?:
          | {
              fid: number;
              hash: string;
            }
          | undefined;
      }[];
      parentCastId?:
        | {
            fid: number;
            hash: string;
          }
        | undefined;
    }): ReplyCastRes => {
      const canWrite = await prepareWrite();
      if (canWrite) {
        setWriting(true);
        const data = {
          text,
          embeds: embeds.map((embed) => ({
            url: embed.url,
          })),
          parentCastId,
        };
        const res = await submitCast(data);
        setWriting(false);
        return { ...res, ...data };
      }
    },
    submitCastWithOpts: async (opts: SubmitCastBody) => {
      const canWrite = await prepareWrite();
      if (canWrite) {
        setWriting(true);
        await submitCast(opts);
        setWriting(false);
      }
    },
    removeCast: async (castHash: string) => {
      const canWrite = await prepareWrite();
      if (canWrite) await removeCast({ castHash });
    },
    likeCast: async (castHash: string, castAuthorFid: number) => {
      const canWrite = await prepareWrite();
      if (canWrite) await likeCast({ castHash, castAuthorFid });
    },
    recastCast: async (castHash: string, castAuthorFid: number) => {
      const canWrite = await prepareWrite();
      if (canWrite) await recastCast({ castHash, castAuthorFid });
    },
    followUser: async (fid: number) => {
      const canWrite = await prepareWrite();
      if (canWrite) await followUser({ fid });
    },
    unfollowUser: async (fid: number) => {
      const canWrite = await prepareWrite();
      if (canWrite) await unfollowUser({ fid });
    },
  };
}
