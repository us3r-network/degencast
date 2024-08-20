import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { useATTFactoryContractInfo } from "./useATTFactoryContract";
import { getTokenInfo } from "./useERC20Contract";
import { useATTContractInfo } from "./useATTContract";
// import { useFetchPrice } from "./use0xSwap";

export default function useATTNftInfo({
  tokenContract,
}: {
  tokenContract: `0x${string}`;
}) {
  const account = useAccount();
  const { getPaymentToken, getGraduated } = useATTFactoryContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const {
    tokenUnit: getTokenUnit,
    maxTokensPerIdPerUser: getMaxTokensPerIdPerUser,
    totalNFTSupply: getTotalNFTSupply,
  } = useATTContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const { graduated } = getGraduated();
  const { data: tokenUnit } = getTokenUnit();
  const { data: maxTokensPerIdPerUser } = getMaxTokensPerIdPerUser();
  const { data: totalNFTSupply } = getTotalNFTSupply();
  const { paymentToken } = getPaymentToken();
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>(undefined);
  
  const [nftTokenInfo, setNftTokenInfo] = useState<TokenWithTradeInfo | undefined>(undefined);

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

  useEffect(() => {
    if (account?.address)
      getTokenInfo({
        address: tokenContract,
        chainId: ATT_CONTRACT_CHAIN.id,
        account: account?.address,
      }).then((tokenInfo) => {
        // console.log("paymentToken tokenInfo", paymentToken, tokenInfo);
        setNftTokenInfo(tokenInfo);
      });
  }, [account?.address]);

  return {
    graduated,
    token,
    tokenUnit,
    maxTokensPerIdPerUser,
    totalNFTSupply,
    nftTokenInfo,
  };
}
