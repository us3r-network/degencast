import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
// import About from "~/components/common/About";
import { useDispatch } from "react-redux";
import NFTImage from "~/components/common/NFTImage";
import NumberField from "~/components/common/NumberField";
import { TokenWithValue } from "~/components/common/TokenInfo";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  DEGEN_TOKEN_METADATA,
  NATIVE_TOKEN_ADDRESS,
  UNISWAP_V3_DEGEN_ETH_POOL_FEES,
} from "~/constants";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTFactoryContractInfo,
  useATTFactoryContractMint,
  useATTFactoryContractMintAA,
} from "~/hooks/trade/useATTFactoryContract";
import useATTNftInfo from "~/hooks/trade/useATTNftInfo";
import { useSwap } from "~/hooks/trade/useUniSwapV3";
import useCurationTokenInfo from "~/hooks/user/useCurationTokenInfo";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import OnChainActionButtonWarper from "../common/OnChainActionButtonWarper";
import { TransationData } from "../common/TranasactionResult";
import UserTokenSelect from "../common/UserTokenSelect";

const GRADUATION_NFT_NUM = 10; // todo:  get from contract or backend
const MintNFT = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    nft: ERC42069Token;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, nft, onSuccess, onError, ...props }, ref) => {
  const dispatch = useDispatch();
  const account = useAccount();
  const { supportAtomicBatch } = useWalletAccount();
  const [amount, setAmount] = useState(1);
  const { graduated, token, maxTokensPerIdPerUser, totalNFTSupply, tokenUnit } =
    useATTNftInfo({
      tokenContract: nft.contractAddress,
    });
  nft.tokenUnit = tokenUnit ? Number(formatUnits(tokenUnit, 18)) : 0;
  const { nftBalanceOf } = useATTContractInfo(nft);
  const { data: nftBalance } = nftBalanceOf(account?.address);
  const { tokenInfo } = useCurationTokenInfo(nft.contractAddress, nft.tokenId);
  // console.log(
  //   "nft info",
  //   graduated,
  //   token,
  //   maxTokensPerIdPerUser,
  //   totalNFTSupply,
  // );
  const [selectedToken, setSelectedToken] =
    useState<TokenWithTradeInfo>(DEGEN_TOKEN_METADATA);

  const [nftPrice, setNftPrice] = useState<bigint>();
  const [nftPriceEth, setNftPriceEth] = useState<bigint>();
  const perNFTPrice =
    selectedToken.address === token?.address
      ? nftPrice && amount && token?.decimals
        ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
        : "0"
      : nftPriceEth && amount && selectedToken?.decimals
        ? formatUnits(nftPriceEth / BigInt(amount), selectedToken.decimals!)
        : "0";

  // console.log("fetchedPrice", fetchedPrice, nftPrice, amount, token);
  const availableAmount = useMemo(() => {
    if (
      !account ||
      !maxTokensPerIdPerUser ||
      !tokenInfo?.bondingCurve?.graduationNftNumber
    )
      return 0;
    const nftLeftBeforeGraduation: number =
      tokenInfo.bondingCurve.graduationNftNumber - Number(totalNFTSupply || 0);
    const nftLeftForPerson: number =
      Number(maxTokensPerIdPerUser) - Number(nftBalance || 0);

    return nftLeftBeforeGraduation > 0
      ? Math.min(nftLeftBeforeGraduation, nftLeftForPerson)
      : nftLeftForPerson;
  }, [totalNFTSupply, nftBalance, maxTokensPerIdPerUser]);
  // console.log("availableAmount", availableAmount);
  const allowanceParams =
    account?.address && token?.address && nftPrice
      ? {
          owner: account.address,
          tokenAddress: token?.address,
          spender: ATT_FACTORY_CONTRACT_ADDRESS,
          value: nftPrice,
        }
      : undefined;
  const onMintSuccess = (data: TransationData) => {
    onSuccess?.(data);
    // todo: update nft info in portfolio page
  };

  return (
    <View className="flex gap-4">
      <NFTImage nft={nft} />
      {supportAtomicBatch(ATT_CONTRACT_CHAIN.id) && (
        <UserTokenSelect
          selectToken={setSelectedToken}
          chain={ATT_CONTRACT_CHAIN}
          defaultToken={DEGEN_TOKEN_METADATA}
        />
      )}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {/* {perNFTPrice ? (
            <Text className="text-xs">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits:
                  selectedToken.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
              }).format(Number(perNFTPrice))}{" "}
              {selectedToken?.symbol} per NFT
            </Text>
          ) : (
            <Text className="text-xs text-secondary">calculating price...</Text>
          )} */}
        </View>
        <NumberField
          defaultValue={1}
          minValue={1}
          maxValue={availableAmount}
          onChange={setAmount}
        />
      </View>
      {token &&
        (graduated ? (
          <MintPriceAfterGraduated
            tokenContract={nft.contractAddress}
            paymentToken={token}
            userSelectedToken={selectedToken}
            nftAmount={amount}
            setNftPrice={setNftPrice}
            setNftPriceEth={setNftPriceEth}
          />
        ) : (
          <MintPriceBeforeGraduated
            tokenContract={nft.contractAddress}
            paymentToken={token}
            userSelectedToken={selectedToken}
            nftAmount={amount}
            setNftPrice={setNftPrice}
            setNftPriceEth={setNftPriceEth}
          />
        ))}
      {token &&
        !!nftPrice &&
        !!amount &&
        (supportAtomicBatch(token?.chainId) ? (
          <OnChainActionButtonWarper
            variant="secondary"
            className="w-full"
            targetChainId={ATT_CONTRACT_CHAIN.id}
            warpedButton={
              <MintButtonAA
                nft={nft}
                paymentToken={token}
                userSelectedToken={selectedToken}
                amount={amount}
                nftPrice={nftPrice}
                nftPriceEth={nftPriceEth}
                onSuccess={onMintSuccess}
                onError={onError}
              />
            }
          />
        ) : (
          <OnChainActionButtonWarper
            variant="secondary"
            className="w-full"
            targetChainId={ATT_CONTRACT_CHAIN.id}
            allowanceParams={allowanceParams}
            warpedButton={
              <MintButton
                nft={nft}
                paymentToken={token}
                userSelectedToken={selectedToken}
                amount={amount}
                nftPrice={nftPrice}
                onSuccess={onMintSuccess}
                onError={onError}
              />
            }
          />
        ))}
    </View>
  );
});

function MintPriceBeforeGraduated({
  tokenContract,
  nftAmount,
  setNftPrice,
  setNftPriceEth,
  paymentToken,
  userSelectedToken,
}: {
  tokenContract: `0x${string}`;
  nftAmount: number;
  setNftPrice: (price: bigint) => void;
  setNftPriceEth: (price: bigint) => void;
  paymentToken: TokenWithTradeInfo;
  userSelectedToken?: TokenWithTradeInfo;
}) {
  // console.log("MintPriceBeforeGraduated", userSelectedToken, nftAmount);
  const {
    fetchSellAmount,
    sellAmount: nftPriceEth,
    ready: swapReady,
  } = useSwap({
    sellToken: userSelectedToken!,
    buyToken: { address: paymentToken.address, chainId: ATT_CONTRACT_CHAIN.id },
    poolFee: UNISWAP_V3_DEGEN_ETH_POOL_FEES,
  });
  const { getMintNFTPriceAfterFee } = useATTFactoryContractInfo({
    contractAddress: tokenContract,
    tokenId: 0,
  });
  const { nftPrice } = getMintNFTPriceAfterFee(nftAmount);
  // console.log(
  //   "nftPrice",
  //   nftPrice,
  //   nftPriceEth,
  //   paymentToken,
  //   userSelectedToken,
  // );
  useEffect(() => {
    if (nftPrice) {
      setNftPrice(nftPrice);
      if (userSelectedToken?.address !== paymentToken.address) {
        if (swapReady) fetchSellAmount(nftPrice);
      }
    }
  }, [nftPrice, swapReady, userSelectedToken]);

  useEffect(() => {
    console.log("nftPriceEth", nftPriceEth);
    if (nftPriceEth) setNftPriceEth(nftPriceEth);
  }, [nftPriceEth]);

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-medium">Total Cost</Text>
      {userSelectedToken?.address === paymentToken.address ? (
        nftPrice && paymentToken ? (
          <Text>
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(
              Number(formatUnits(nftPrice, paymentToken.decimals!)),
            )}{" "}
            {paymentToken.symbol}
          </Text>
        ) : (
          <Text>fetching price...</Text>
        )
      ) : nftPriceEth && userSelectedToken ? (
        <Text>
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 6,
          }).format(
            Number(formatUnits(nftPriceEth, userSelectedToken.decimals!)),
          )}{" "}
          {userSelectedToken.symbol}
        </Text>
      ) : (
        <Text>fetching price...</Text>
      )}
    </View>
  );
}

function MintPriceAfterGraduated({
  tokenContract,
  nftAmount,
  setNftPrice,
  setNftPriceEth,
  paymentToken,
  userSelectedToken,
}: {
  tokenContract: `0x${string}`;
  nftAmount: number;
  setNftPrice: (price: bigint) => void;
  setNftPriceEth: (price: bigint) => void;
  paymentToken: TokenWithTradeInfo;
  userSelectedToken: TokenWithTradeInfo;
}) {
  const { tokenUnit } = useATTNftInfo({
    tokenContract,
  });
  const {
    fetchSellAmount,
    sellAmount,
    ready: swapReady,
  } = useSwap({
    sellToken: paymentToken,
    buyToken: { address: tokenContract, chainId: ATT_CONTRACT_CHAIN.id },
  });
  const {
    fetchSellAmount: fetchSellAmountEth,
    sellAmount: nftPriceEth,
    ready: swapReadyEth,
  } = useSwap({
    sellToken: userSelectedToken,
    buyToken: paymentToken,
    poolFee: UNISWAP_V3_DEGEN_ETH_POOL_FEES,
  });

  useEffect(() => {
    // console.log("nftAmount", nftAmount, tokenUnit, swapReady);
    if (nftAmount && tokenUnit && swapReady)
      fetchSellAmount(BigInt(nftAmount) * BigInt(tokenUnit));
  }, [nftAmount, tokenUnit, swapReady]);

  const nftPrice = sellAmount
    ? sellAmount + sellAmount / 10n + sellAmount / 2000n //add 10% fee and 0.05% sliperage
    : undefined;

  useEffect(() => {
    if (nftPrice) setNftPrice(nftPrice);
  }, [nftPrice]);

  useEffect(() => {
    if (nftPrice) {
      setNftPrice(nftPrice);
      if (userSelectedToken?.address !== paymentToken.address) {
        if (swapReadyEth) fetchSellAmountEth(nftPrice);
      }
    }
  }, [nftPrice, swapReadyEth, userSelectedToken]);

  useEffect(() => {
    if (nftPriceEth) setNftPriceEth(nftPriceEth);
  }, [nftPriceEth]);

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-medium">Total Cost</Text>
      {userSelectedToken?.address === paymentToken.address ? (
        nftPrice && paymentToken ? (
          <Text>
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(
              Number(formatUnits(nftPrice, paymentToken.decimals!)),
            )}{" "}
            {paymentToken.symbol}
          </Text>
        ) : (
          <Text>fetching price...</Text>
        )
      ) : nftPriceEth && userSelectedToken ? (
        <Text>
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 6,
          }).format(
            Number(formatUnits(nftPriceEth, userSelectedToken.decimals!)),
          )}{" "}
          {userSelectedToken.symbol}
        </Text>
      ) : (
        <Text>fetching price...</Text>
      )}
    </View>
  );
}

function MintButton({
  nft,
  paymentToken,
  userSelectedToken,
  amount,
  nftPrice,
  onSuccess,
  onError,
}: {
  nft: ERC42069Token;
  paymentToken: TokenWithTradeInfo;
  userSelectedToken?: TokenWithTradeInfo;
  amount: number;
  nftPrice: bigint;
  onSuccess?: (data: TransationData) => void;
  onError?: (error: string) => void;
}) {
  const {
    mint,
    transactionReceipt,
    writeError,
    transationError,
    isPending,
    isSuccess,
  } = useATTFactoryContractMint(nft);

  useEffect(() => {
    if (isSuccess && transactionReceipt && paymentToken && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text>Mint {amount} nfts and cost</Text>
            <TokenWithValue token={paymentToken} value={nftPrice} />
          </View>
        ),
        amount,
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      onError?.(
        writeError?.message || transationError?.message || "Something Wrong!",
      );
    }
  }, [writeError, transationError]);
  return (
    <Button
      variant="secondary"
      className="w-full bg-[#00D1A7]"
      disabled={
        !nftPrice ||
        isPending ||
        Number(paymentToken?.rawBalance || 0) < Number(nftPrice)
      }
      onPress={() => {
        if (nftPrice && paymentToken) mint(amount, nftPrice);
      }}
    >
      <Text className="text-base font-medium">
        {isPending
          ? "Confirming..."
          : `Mint & Get ${new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format((nft.tokenUnit || 0) * amount)} $${nft.symbol}`}
      </Text>
    </Button>
  );
}

function MintButtonAA({
  nft,
  paymentToken,
  userSelectedToken,
  amount,
  nftPrice,
  nftPriceEth,
  onSuccess,
  onError,
}: {
  nft: ERC42069Token;
  paymentToken: TokenWithTradeInfo;
  userSelectedToken?: TokenWithTradeInfo;
  amount: number;
  nftPrice: bigint;
  nftPriceEth?: bigint;
  onSuccess?: (data: TransationData) => void;
  onError?: (error: string) => void;
}) {
  const {
    mint,
    transactionReceipt,
    writeError,
    transationError,
    isPending,
    isSuccess,
  } = useATTFactoryContractMintAA(nft);

  useEffect(() => {
    if (isSuccess && transactionReceipt && paymentToken && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text>Mint {amount} nfts and cost</Text>
            <TokenWithValue
              token={
                userSelectedToken?.address === NATIVE_TOKEN_ADDRESS
                  ? userSelectedToken
                  : paymentToken
              }
              value={
                userSelectedToken?.address === NATIVE_TOKEN_ADDRESS
                  ? nftPriceEth || 0
                  : nftPrice
              }
            />
          </View>
        ),
        amount,
      };
      onSuccess?.(transationData);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (writeError || transationError) {
      onError?.(
        writeError?.message || transationError?.message || "Something Wrong!",
      );
    }
  }, [writeError, transationError]);
  return (
    <Button
      variant="secondary"
      className="w-full bg-[#00D1A7]"
      disabled={
        !nftPrice ||
        isPending ||
        Number(paymentToken?.rawBalance || 0) < Number(nftPrice)
      }
      onPress={() => {
        if (nftPrice && paymentToken)
          mint(amount, nftPrice, paymentToken, userSelectedToken);
      }}
    >
      <Text className="text-base font-medium">
        {isPending
          ? "Confirming..."
          : `Mint & Get ${new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format((nft.tokenUnit || 0) * amount)} $${nft.symbol}`}
      </Text>
    </Button>
  );
}

export default MintNFT;
