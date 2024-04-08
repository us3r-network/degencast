import { useCallback, useState } from "react";
import { notifyTipApi } from "~/services/farcaster/api";
import useFarcasterWrite from "../social-farcaster/useFarcasterWrite";
import { FarCast } from "~/services/farcaster/types";
import useFarcasterAccount from "../social-farcaster/useFarcasterAccount";

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
        await submitCastWithOpts({
          text: `${allowanceValue} $DEGEN`,
          embeds: [],
          embedsDeprecated: [],
          mentions: [],
          mentionsPositions: [],
          parentCastId: {
            hash: Buffer.from(cast.hash.data),
            fid: Number(cast.fid),
          },
        });
        await notifyTipApi({
          fromFid: currFid as number,
          amount: Number(allowanceValue),
          txHash: "",
          type: "Allowance",
          castHash: Buffer.from(cast.hash.data).toString("hex"),
        });
        onSuccess?.();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [cast, currFid, loading, onSuccess],
  );

  return { loading, degenAllowanceAction };
}
