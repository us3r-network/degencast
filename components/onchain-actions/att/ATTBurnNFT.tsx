import { forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import NFTImage from "~/components/common/NFTImage";
import NumberField from "~/components/common/NumberField";
import { TokenWithValue } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTBurnNFT,
  useATTFactoryContractInfo,
} from "~/hooks/trade/useATTFactoryContract";
import useATTNftInfo from "~/hooks/trade/useATTNftInfo";
import { ERC42069Token } from "~/services/trade/types";
import OnChainActionButtonWarper from "../common/OnChainActionButtonWarper";
import { TransationData } from "../common/TranasactionResult";

const BurnNFT = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    nft: ERC42069Token;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, nft, onSuccess, onError, ...props }, ref) => {
  const dispatch = useDispatch();
  const account = useAccount();
  const [amount, setAmount] = useState(1);

  const {
    burn,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useATTBurnNFT(nft);

  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text className="text-white">Sell {amount} NFTs and receive</Text>
            {graduated ? (
              <TokenWithValue
                token={nftTokenInfo!}
                value={tokenUnit! * BigInt(amount)}
              />
            ) : (
              <TokenWithValue token={token} value={nftPrice} />
            )}
          </View>
        ),
      };
      onSuccess?.(transationData);
      // todo: update nft info in portfolio page
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      onError?.(
        writeError?.message || transationError?.message || "Something Wrong!",
      );
    }
  }, [writeError, transationError]);

  const { nftBalanceOf } = useATTContractInfo(nft);
  const { data: balance } = nftBalanceOf(account?.address);
  const { token, graduated, tokenUnit, nftTokenInfo } = useATTNftInfo({
    tokenContract: nft.contractAddress,
  });
  nft.tokenUnit = tokenUnit ? Number(formatUnits(tokenUnit, 18)) : 0;
  const { getBurnNFTPriceAfterFee } = useATTFactoryContractInfo({
    contractAddress: nft.contractAddress,
    tokenId: 0,
  });
  const { nftPrice } = getBurnNFTPriceAfterFee(amount);

  return (
    <View className="flex gap-4">
      <NFTImage nft={nft} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {/* {graduated ? (
            tokenUnit && !!nftTokenInfo ? (
              <Text className="text-xs">
                {formatUnits(tokenUnit, nftTokenInfo.decimals || 18)}{" "}
                {nftTokenInfo.symbol} per NFT
              </Text>
            ) : (
              <Text className="text-xs">calculating price...</Text>
            )
          ) : nftPrice && amount && token && token.decimals ? (
            <Text className="text-xs">
              {formatUnits(nftPrice / BigInt(amount), token.decimals)}
              {token?.symbol} per NFT
            </Text>
          ) : (
            <Text className="text-xs">calculating price...</Text>
          )} */}
        </View>
        <NumberField
          defaultValue={1}
          minValue={1}
          maxValue={Number(balance)}
          onChange={setAmount}
        />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-medium">Receive:</Text>
        {graduated ? (
          tokenUnit && !!nftTokenInfo ? (
            <Text className="text-xs">
              {formatUnits(
                tokenUnit * BigInt(amount),
                nftTokenInfo.decimals || 18,
              )}{" "}
              {nftTokenInfo.symbol}
            </Text>
          ) : (
            <Text className="text-xs">calculating price...</Text>
          )
        ) : nftPrice && amount && token && token.decimals ? (
          <Text className="text-md">
            {formatUnits(nftPrice, token.decimals)} {token.symbol}
          </Text>
        ) : (
          <Text className="text-md">fetching price...</Text>
        )}
      </View>
      <OnChainActionButtonWarper
        variant="secondary"
        className="w-full"
        targetChainId={ATT_CONTRACT_CHAIN.id}
        warpedButton={
          <Button
            variant="secondary"
            className="w-full bg-[#F41F4C]"
            disabled={!account || waiting || writing || !balance}
            onPress={() => burn(amount)}
          >
            <Text className="text-base font-medium">
              {waiting || writing
                ? "Confirming..."
                : `Burn & Sell ${new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format((nft.tokenUnit || 0) * amount)} $${nft.symbol}`}
            </Text>
          </Button>
        }
      />
    </View>
  );
});

export default BurnNFT;
