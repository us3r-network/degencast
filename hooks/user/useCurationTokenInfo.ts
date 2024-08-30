import { useEffect, useState } from "react";
import { Address } from "viem";
import { ApiRespCode } from "~/services/shared/types";
import { curationTokenInfo } from "~/services/trade/api";
import { CurationTokenInfo } from "~/services/trade/types";

export default function useCurationTokenInfo(
  address: Address,
  tokenId: number,
) {
  const [tokenInfo, setTokenInfo] = useState<CurationTokenInfo | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await curationTokenInfo(address, tokenId);
      if (res.data.code === ApiRespCode.SUCCESS) {
        setTokenInfo(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && tokenId && !loading) load();
  }, [address, tokenId]);

  return {
    loading,
    tokenInfo,
  };
}
