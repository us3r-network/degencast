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
        const tipCast = {
          text: `${allowanceValue} $DEGEN`,
          parentCastId: {
            hash: ALLOWANCE_CAST_HASH,
            fid: Number(ALLOWANCE_CAST_FID),
          },
        };
        console.log("tipCast", tipCast);

        const res = await submitCast(tipCast);
        if (!res?.hash) {
          throw new Error("Failed to tip");
        }
        console.log("submitCast res", res);
        const notifyRes = await notifyTipApi({
          fromFid: currFid as number,
          amount: Number(allowanceValue),
          txHash: "",
          type: "Allowance",
          castHash: ALLOWANCE_CAST_HASH,
        });
        console.log("notifyRes res", notifyRes);
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
