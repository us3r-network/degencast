import { FarCast } from "~/services/farcaster/types";
import getCastId from "./getCastId";
import { CastId } from "@external-types/farcaster";
import { NeynarCast } from "~/services/farcaster/types/neynar";

export function isNeynarCast(cast: FarCast | NeynarCast) {
  return typeof cast?.hash === "string" && cast.hash.startsWith("0x");
}

export function getCastHex(cast: FarCast | NeynarCast) {
  if (!cast) return "";
  if (isNeynarCast(cast)) {
    return (cast as NeynarCast)?.hash.slice(2);
  } else {
    const castId: CastId = getCastId({ cast } as {
      cast: FarCast;
    });
    return Buffer.from(castId.hash).toString("hex");
  }
}

export function getCastFid(cast: FarCast | NeynarCast) {
  if (isNeynarCast(cast)) {
    return String((cast as NeynarCast).author.fid);
  }
  return (cast as FarCast).fid;
}

export function getCastParentUrl(cast: FarCast | NeynarCast) {
  if (isNeynarCast(cast)) {
    return (cast as NeynarCast)?.parent_url;
  }
  return (cast as FarCast)?.parentUrl || (cast as FarCast)?.parent_url;
}

export function getCastReactionsCount(cast: FarCast | NeynarCast) {
  if (isNeynarCast(cast)) {
    return {
      likesCount: (cast as NeynarCast)?.reactions?.likes_count || 0,
      recastsCount: (cast as NeynarCast)?.reactions?.recasts_count || 0,
    };
  }
  return {
    likesCount: Number(
      (cast as FarCast)?.like_count || (cast as FarCast)?.likesCount || 0,
    ),
    recastsCount: Number(
      (cast as FarCast)?.recast_count || (cast as FarCast)?.recastsCount || 0,
    ),
  };
}

export function getCastRepliesCount(cast: FarCast | NeynarCast) {
  if (isNeynarCast(cast)) {
    return (cast as NeynarCast)?.replies?.count || 0;
  }
  return Number(
    (cast as FarCast)?.comment_count || (cast as FarCast)?.repliesCount || 0,
  );
}

export function getCastViewerContext(cast: FarCast | NeynarCast) {
  if (isNeynarCast(cast)) {
    return (cast as NeynarCast)?.viewer_context;
  }
  return (cast as FarCast)?.viewerContext;
}
