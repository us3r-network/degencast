import { FarCast } from "~/services/farcaster/types";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import {
  getCastHex,
  getCastReactionsCount,
  getCastViewerContext,
} from "./cast-utils";

export function getReactionsCountAndViewerContexts(casts: Array<NeynarCast>) {
  const data = casts.reduce(
    (
      acc: {
        [key: string]: any;
      },
      cast,
    ) => {
      const castHex = getCastHex(cast);
      const reactions = getCastReactionsCount(cast);
      acc[castHex] = reactions;

      const viewerContext = getCastViewerContext(cast);
      if (viewerContext) {
        acc[castHex] = {
          ...acc[castHex],
          ...viewerContext,
        };
      }
      return acc;
    },
    {},
  );
  return data;
}
