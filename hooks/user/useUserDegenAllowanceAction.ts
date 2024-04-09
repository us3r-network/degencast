import { useCallback, useState } from "react";
import { notifyTipApi } from "~/services/farcaster/api";
import useFarcasterWrite from "../social-farcaster/useFarcasterWrite";
import { FarCast } from "~/services/farcaster/types";
import useFarcasterAccount from "../social-farcaster/useFarcasterAccount";
import getCastHex from "~/utils/farcaster/getCastHex";

export default function useUserDegenAllowanceAction({
  cast,
  onSuccess,
}: {
  cast: FarCast;
  onSuccess?: () => void;
}) {
  const { currFid } = useFarcasterAccount();
  const { submitCastWithOpts } = useFarcasterWrite();
  const [loading, setLoading] = useState<boolean>(false);

  const degenAllowanceAction = useCallback(
    async (allowanceValue: number) => {
      if (loading) return;
      try {
        setLoading(true);
        const castHex = getCastHex(cast);
        await submitCastWithOpts({
          text: `${allowanceValue} $DEGEN`,
          parentCastId: {
            hash: castHex,
            fid: Number(cast.fid),
          },
        });
        await notifyTipApi({
          fromFid: currFid as number,
          amount: Number(allowanceValue),
          txHash: "",
          type: "Allowance",
          castHash: castHex,
        });
        onSuccess?.();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [cast, currFid, loading, onSuccess, submitCastWithOpts],
  );

  return { loading, degenAllowanceAction };
}
