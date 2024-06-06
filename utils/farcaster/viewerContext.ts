import { FarCast } from "~/services/farcaster/types";
import getCastHex from "./getCastHex";

export function viewerContextsFromCasts(casts: Array<FarCast>) {
  const viewerContexts = casts.reduce(
    (
      acc: {
        [key: string]: any;
      },
      cast,
    ) => {
      const castHex = getCastHex(cast);
      const viewerContext = cast?.viewerContext;
      if (viewerContext) {
        acc[castHex] = viewerContext;
      }
      return acc;
    },
    {},
  );
  return viewerContexts;
}
