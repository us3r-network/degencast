import { useAccount } from "wagmi";
import { useATTFactoryContractInfo } from "./useATTFactoryContract";
import { useEffect, useState } from "react";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { getTokenInfo } from "./useERC20Contract";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";

export default function useATTNftPrice({
  tokenContract,
  nftAmount = 1,
}: {
  tokenContract: `0x${string}`;
  nftAmount?: number;
}) {
  const account = useAccount();
  const { getMintNFTPrice, getPaymentToken } = useATTFactoryContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const { nftPrice } = getMintNFTPrice(nftAmount);
  const { paymentToken } = getPaymentToken();
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>(undefined);
  useEffect(() => {
    if (paymentToken && account?.address)
      getTokenInfo({
        address: paymentToken,
        chainId: ATT_CONTRACT_CHAIN.id,
        account: account?.address,
      }).then((tokenInfo) => {
        // console.log("paymentToken tokenInfo", paymentToken, tokenInfo);
        setToken(tokenInfo);
      });
  }, [paymentToken, account?.address]);
  const fetchedPrice = !!(nftPrice && token && token.decimals);
  return {
    fetchedPrice,
    nftPrice,
    token,
  };
}
