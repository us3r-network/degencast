import { useCallback, useState } from "react";
import { notifyTipApi } from "~/services/farcaster/api";
import { ALLOWANCE_CAST_FID, ALLOWANCE_CAST_HASH } from "~/constants/farcaster";
import useFarcasterAccount from "../useFarcasterAccount";
import useFarcasterWrite from "../useFarcasterWrite";

export default function useTipAllowanceToDegencast() {
  const { currFid } = useFarcasterAccount();
  const { submitCast } = useFarcasterWrite();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tipToDegencast = useCallback(
    async (
      allowanceValue: number,
      opts: {
        onSuccess?: () => void;
        onError?: (error: any) => void;
      },
    ) => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        await submitCast({
          text: `${allowanceValue} $DEGEN`,
          parentCastId: {
            hash: ALLOWANCE_CAST_HASH,
            fid: Number(ALLOWANCE_CAST_FID),
          },
        });
        await notifyTipApi({
          fromFid: currFid as number,
          amount: Number(allowanceValue),
          txHash: "",
          type: "Allowance",
          castHash: ALLOWANCE_CAST_HASH,
        });
        opts.onSuccess?.();
      } catch (error) {
        console.error(error);
        opts.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [currFid, isLoading, submitCast],
  );

  return { isLoading, tipToDegencast };
}
