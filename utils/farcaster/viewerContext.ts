import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex, getCastViewerContext } from "./cast-utils";

export function viewerContextsFromCasts(casts: Array<FarCast | NeynarCast>) {
  const viewerContexts = casts.reduce(
    (
      acc: {
        [key: string]: any;
      },
      cast,
    ) => {
      const castHex = getCastHex(cast);
      const viewerContext = getCastViewerContext(cast);
      if (viewerContext) {
        acc[castHex] = viewerContext;
      }
      return acc;
    },
    {},
  );
  return viewerContexts;
}
