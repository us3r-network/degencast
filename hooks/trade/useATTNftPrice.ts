import { useAccount } from "wagmi";
import { useATTFactoryContractInfo } from "./useATTFactoryContract";
import { useCallback, useEffect, useState } from "react";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import { getTokenInfo } from "./useERC20Contract";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { Address } from "viem";
import { useFetchPrice } from "./use0xSwap";
import { useATTContractInfo } from "./useATTContract";

enum NFT_ACTION {
  MINT = "mint",
  BURN = "burn",
}
export default function useATTNftPrice({
  tokenContract,
  nftAmount = 1,
  action = NFT_ACTION.MINT,
}: {
  tokenContract: `0x${string}`;
  nftAmount?: number;
  action?: NFT_ACTION;
}) {
  const account = useAccount();
  const {
    getMintNFTPriceAfterFee,
    getBurnNFTPriceAfterFee,
    getPaymentToken,
    getGraduated,
  } = useATTFactoryContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });

  const { graduated } = getGraduated();

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

  let nftPrice;
  switch (action) {
    case NFT_ACTION.MINT:
      const { nftPrice: mintNFTPrice } = getMintNFTPriceAfterFee(nftAmount);
      nftPrice = mintNFTPrice;
      break;
    case NFT_ACTION.BURN:
      const { nftPrice: burnNFTPrice } = getBurnNFTPriceAfterFee(nftAmount);
      nftPrice = burnNFTPrice;
      break;
  }
  const fetchedPrice = !!(nftPrice && token && token.decimals);

  return {
    graduated,
    fetchedPrice,
    nftPrice,
    token,
  };
}

//这实际上是个hook，但是没有用use开头，所以不是一个标准的hook
export function getATTNFTPriceFrom0x({
  tokenContract,
  nftAmount = 1,
  action = NFT_ACTION.MINT,
}: {
  tokenContract: `0x${string}`;
  nftAmount?: number;
  action?: NFT_ACTION;
}) {
  const account = useAccount();

  const { getPaymentToken, getGraduated } = useATTFactoryContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const { graduated } = getGraduated();

  const { paymentToken } = getPaymentToken();

  const [nftPrice, setNftPrice] = useState<bigint | undefined>(undefined);
  const [stutas, setStatus] = useState<
    "pending" | "success" | "error" | "idle"
  >("idle");
  const { getTokenUnit } = useATTContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const { data: tokenUnit } = getTokenUnit();
  // const tokenUnit = 1000000000000000000n;
  const { fetchPrice: fetchPriceFrom0x } = useFetchPrice(account.address);
  const fetchPrice = async () => {
    setStatus("pending");
    const zeroXPriceData = await fetchPriceFrom0x({
      sellToken: {
        address: paymentToken as Address,
        chainId: ATT_CONTRACT_CHAIN.id,
      },

      buyToken: {
        address: tokenContract,
        chainId: ATT_CONTRACT_CHAIN.id,
      },

      buyAmount: String(BigInt(nftAmount) * BigInt(tokenUnit!)),
    });
    const sellAmount = zeroXPriceData?.price?.sellAmount as bigint;
    const nftPrice = sellAmount ? sellAmount + sellAmount / 10n : undefined;
    return { nftPrice };
  };

  useEffect(() => {
    if (paymentToken && tokenContract && nftAmount && tokenUnit && graduated) {
      fetchPrice()
        .then(({ nftPrice }) => {
          setNftPrice(nftPrice);
          setStatus("success");
        })
        .catch(() => {
          setStatus("error");
        });
    }
  }, [paymentToken, tokenContract, nftAmount, tokenUnit, graduated]);

  return {
    nftPrice,
  };
}
