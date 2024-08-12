import { Address } from "viem";
import { useATTFactoryContractInfo } from "./useATTFactoryContract";

export default function useATTNftPrice({
  tokenContract,
  nftAmount = 1,
}: {
  tokenContract: Address;
  nftAmount?: number;
}) {
  const { getMintNFTPriceAfterFee } =
    useATTFactoryContractInfo({
      contractAddress: tokenContract,
      tokenId: 0,
    });

  const { nftPrice } = getMintNFTPriceAfterFee(nftAmount);

  return {
    nftPrice,
  };
}
