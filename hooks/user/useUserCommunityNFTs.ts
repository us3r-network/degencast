import { uniqWith } from "lodash";
import { useEffect, useState } from "react";
import { ApiRespCode } from "~/services/shared/types";
import { ERC42069Token } from "~/services/trade/types";
import { myNFTs } from "~/services/user/api";

export default function useUserCommunityNFTs(address?: `0x${string}`) {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ERC42069Token[]>([]);
  const load = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const data = await myNFTs(address);
      if (data.data.code === ApiRespCode.SUCCESS) {
        const nfts = uniqWith(data.data.data, (a, b) => {
          return (
            a.contractAddress === b.contractAddress && a.tokenId === b.tokenId
          );
        });
        setItems(nfts);
      } else throw new Error(data.data.msg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    load();
  }, [address]);

  return {
    items,
    loading,
    load,
  };
}
