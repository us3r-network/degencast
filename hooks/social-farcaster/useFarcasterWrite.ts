import { HubRestAPIClient } from "@standard-crypto/farcaster-js-hub-rest";
import axios from "axios";
import { useCallback, useState } from "react";
import { FARCASTER_HUB_URL } from "~/constants/farcaster";
import useFarcasterAccount from "./useFarcasterAccount";
import useFarcasterSigner from "./useFarcasterSigner";

const hubClient = new HubRestAPIClient({
  hubUrl: FARCASTER_HUB_URL,
  axiosInstance: axios.create(),
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
  const { farcasterAccount } = useFarcasterAccount();
  const { requesting, getPrivySigner } = useFarcasterSigner();

  const [writing, setWriting] = useState(false);

  const submitCast = useCallback(
    async (data: SubmitCastBody) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) return;
      try {
        setWriting(true);
        const result = await hubClient.submitCast(
          {
            text: data.text,
            embeds: data.embeds?.map((embed) => ({
              url: embed.url,
            })),
            // parentUrl: data.parentUrl,
            ...(data.parentUrl ? { parentUrl: data.parentUrl } : {}),
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
    [farcasterAccount, getPrivySigner],
  );

  const removeCast = useCallback(
    async (castHash: string) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) return;
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
    [farcasterAccount, getPrivySigner],
  );

  const submitReaction = useCallback(
    async (
      type: "like" | "recast",
      castHash: string,
      castAuthorFid: number,
    ) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) {
        throw new Error("No privy signer");
      }
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
    },
    [farcasterAccount, getPrivySigner],
  );
  const removeReaction = useCallback(
    async (
      type: "like" | "recast",
      castHash: string,
      castAuthorFid: number,
    ) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) {
        throw new Error("No privy signer");
      }
      const result = await hubClient.removeReaction(
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
    },
    [farcasterAccount, getPrivySigner],
  );
  const likeCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return await submitReaction("like", castHash, castAuthorFid);
    },
    [submitReaction],
  );
  const removeLikeCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return await removeReaction("like", castHash, castAuthorFid);
    },
    [removeReaction],
  );
  const recastCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return await submitReaction("recast", castHash, castAuthorFid);
    },
    [submitReaction],
  );
  const removeRecastCast = useCallback(
    async (castHash: string, castAuthorFid: number) => {
      return await removeReaction("recast", castHash, castAuthorFid);
    },
    [removeReaction],
  );

  const followUser = useCallback(
    async (fid: number) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) return;
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
    [farcasterAccount, getPrivySigner],
  );

  const unfollowUser = useCallback(
    async (fid: number) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) return;
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
    [farcasterAccount, getPrivySigner],
  );

  return {
    writing: writing || requesting,
    submitCast,
    replayCast: submitCast,
    submitCastWithOpts: submitCast,
    removeCast: removeCast,
    likeCast: likeCast,
    removeLikeCast: removeLikeCast,
    recastCast: recastCast,
    removeRecastCast: removeRecastCast,
    followUser: followUser,
    unfollowUser: unfollowUser,
  };
}
