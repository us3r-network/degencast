import { FarCast } from "~/services/farcaster/types";
import getCastId from "./getCastId";
import { CastId } from "@external-types/farcaster";

export default function getCastHex(cast: FarCast) {
  const castId: CastId = getCastId({ cast });
  return Buffer.from(castId.hash).toString("hex");
}
