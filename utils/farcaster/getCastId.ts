import { CastId } from "@farcaster/hub-web";
import { FarCast } from "~/services/farcaster/types";

export default function getCastId({ cast }: { cast: FarCast }): CastId {
  return {
    fid: Number(cast.fid),
    hash: Uint8Array.from(cast.hash.data),
  };
}
