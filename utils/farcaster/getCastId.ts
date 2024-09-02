import { CastId } from "@external-types/farcaster";
import { FarCast } from "~/services/farcaster/types";

export default function getCastId({ cast }: { cast: FarCast }): CastId {
  if (!cast.fid || !cast.hash?.data) return { fid: 0, hash: new Uint8Array() };
  return {
    fid: Number(cast.fid),
    hash: Uint8Array.from(cast.hash.data),
  };
}
