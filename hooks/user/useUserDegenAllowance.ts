import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { getUserDegenTipAllowance } from "~/services/farcaster/api";

export default function useUserDegenAllowance() {
  const { address } = useAccount();
  const [totalDegenAllowance, setTotalDegenAllowance] = useState<number>(0);
  const [remainingDegenAllowance, setRemainingDegenAllowance] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const loadDegenAllowance = useCallback(async () => {
    try {
      setLoading(true);
      const { data: allowanceData } = await getUserDegenTipAllowance(
        address as string,
      );
      setTotalDegenAllowance(allowanceData.data?.[0]?.tip_allowance || "0");
      setRemainingDegenAllowance(
        allowanceData.data?.[0]?.remaining_allowance || "0",
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [address]);
  return {
    totalDegenAllowance,
    remainingDegenAllowance,
    loadDegenAllowance,
    loading,
  };
}
