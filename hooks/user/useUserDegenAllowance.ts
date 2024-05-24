import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { getUserDegenTipAllowance } from "~/services/farcaster/api";
import useFarcasterAccount from "../social-farcaster/useFarcasterAccount";

export default function useUserDegenAllowance(params?: {
  address?: string;
  fid?: string | number;
}) {
  const { address: ownerAddress, fid: ownerFid } = params || {};
  const { user } = usePrivy();
  const { currFid } = useFarcasterAccount();
  const { address: connectedAddress } = useAccount();

  const address =
    ownerFid || ownerAddress
      ? ownerAddress
      : user?.farcaster?.ownerAddress || connectedAddress;
  const fid = ownerFid || ownerAddress ? ownerFid : currFid;

  const [totalDegenAllowance, setTotalDegenAllowance] = useState<number>(0);
  const [remainingDegenAllowance, setRemainingDegenAllowance] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const loadDegenAllowance = useCallback(async () => {
    try {
      setLoading(true);
      const { data: allowanceData } = await getUserDegenTipAllowance({
        address: address as string,
        fid,
      });
      setTotalDegenAllowance(allowanceData.data?.[0]?.tip_allowance || "0");
      setRemainingDegenAllowance(
        allowanceData.data?.[0]?.remaining_allowance || "0",
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [address, fid]);
  return {
    totalDegenAllowance,
    remainingDegenAllowance,
    loadDegenAllowance,
    loading,
  };
}
