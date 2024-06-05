import {
  FarcasterWithMetadata,
  usePrivy
} from "@privy-io/react-auth";
import {
  HubRestAPIClient
} from "@standard-crypto/farcaster-js-hub-rest";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { FARCASTER_HUB_URL, NEYNAR_API_KEY } from "~/constants/farcaster";
import useFarcasterSigner from "./useFarcasterSigner";

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
  const { user } = usePrivy();
  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster",
  ) as FarcasterWithMetadata;

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
    [farcasterAccount],
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
    [farcasterAccount],
  );

  const reactionCast = useCallback(
    async (
      type: "like" | "recast",
      castHash: string,
      castAuthorFid: number,
    ) => {
      const privySigner = await getPrivySigner();
      if (!privySigner) return;
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
    [farcasterAccount],
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
    [farcasterAccount],
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
    [farcasterAccount],
  );

  return {
    writing: writing || requesting,
    submitCast,
    replayCast: submitCast,
    submitCastWithOpts: submitCast,
    removeCast: removeCast,
    likeCast: likeCast,
    recastCast: recastCast,
    followUser: followUser,
    unfollowUser: unfollowUser,
  };
}
