import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
// import About from "~/components/common/About";
import NFTImage from "~/components/common/NFTImage";
import NumberField from "~/components/common/NumberField";
import { TokenWithValue } from "~/components/common/TokenInfo";
import UserWalletSelect from "~/components/portfolio/tokens/UserWalletSelect";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { DEGEN_TOKEN_METADATA } from "~/constants";
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
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import { TokenActivitieList } from "../activity/Activities";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import UserTokenSelect from "./UserTokenSelect";

export function BuyButton({
  token,
  renderButton,
  onSuccess,
}: {
  token: ERC42069Token;
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
  onSuccess?: (mintNum: number) => void;
}) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const [open, setOpen] = useState(false);
  const handlePress = () => {
    if (!account.address) {
      connectWallet();
      return;
    }
    setOpen(true);
  };
  return (
    <Pressable>
      {renderButton ? (
        renderButton({ onPress: handlePress })
      ) : (
        <Button
          className={cn("w-14")}
          size="sm"
          variant={"secondary"}
          onPress={handlePress}
        >
          <Text>Mint</Text>
        </Button>
      )}

      {account.address && (
        <BuyDialog
          token={token}
          open={open}
          onOpenChange={setOpen}
          onSuccess={onSuccess}
        />
      )}
    </Pressable>
  );
}

export function BuyDialog({
  token,
  open,
  onOpenChange,
  onSuccess,
}: {
  token: ERC42069Token;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (mintNum: number) => void;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setTransationData(undefined);
        setError("");
        onOpenChange(o);
      }}
    >
      {!transationData && !error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("mr-4 flex-row items-center")}>
            <Pressable
              disabled={!showDetails}
              onPress={() => setShowDetails(false)}
            >
              <Text className={showDetails ? "text-secondary" : "text-white"}>
                NFT
              </Text>
            </Pressable>
            <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
            <Pressable
              disabled={showDetails}
              onPress={() => setShowDetails(true)}
            >
              <Text className={!showDetails ? "text-secondary" : "text-white"}>
                Details
              </Text>
            </Pressable>
          </DialogHeader>
          <ScrollView
            className="max-h-[80vh] w-full"
            showsHorizontalScrollIndicator={false}
          >
            {showDetails ? (
              <TokenActivitieList token={token} />
            ) : (
              <View className="gap-4">
                <View className="flex-row items-center justify-between gap-2">
                  <Text>Active Wallet</Text>
                  <UserWalletSelect />
                </View>
                <MintNFT
                  nft={token}
                  onSuccess={(data) => {
                    setTransationData(data);
                    onSuccess?.(data.amount || 0);
                  }}
                  onError={setError}
                />
                {/* <DialogFooter>
                  <About title={ATT_TITLE} info={ATT_INFO} />
                </DialogFooter> */}
              </View>
            )}
          </ScrollView>
        </DialogContent>
      )}
      {transationData && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionInfo
            data={transationData}
            buttonText="Mint more"
            buttonAction={() => setTransationData(undefined)}
          />
        </DialogContent>
      )}
      {error && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <ErrorInfo
            error={error}
            buttonText="Try Again"
            buttonAction={() => setError("")}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

const GRADUATION_NFT_NUM = 10; // todo:  get from contract or backend
const MintNFT = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    nft: ERC42069Token;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, nft, onSuccess, onError, ...props }, ref) => {
  const account = useAccount();
  const { supportAtomicBatch } = useWalletAccount();
  const [amount, setAmount] = useState(1);
  const { graduated, token, maxTokensPerIdPerUser, totalNFTSupply } =
    useATTNftInfo({
      tokenContract: nft.contractAddress,
    });
  const { nftBalanceOf } = useATTContractInfo(nft);
  const { data: nftBalance } = nftBalanceOf(account?.address);
  // console.log(
  //   "nft info",
  //   graduated,
  //   token,
  //   maxTokensPerIdPerUser,
  //   totalNFTSupply,
  // );
  const [nftPrice, setNftPrice] = useState<bigint>();
  const perNFTPrice =
    nftPrice && amount && token?.decimals
      ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
      : "0";
  // console.log("fetchedPrice", fetchedPrice, nftPrice, amount, token);
  const availableAmount = useMemo(() => {
    if (!account || !maxTokensPerIdPerUser) return 0;
    const nftLeftBeforeGraduation: number =
      GRADUATION_NFT_NUM - Number(totalNFTSupply || 0);
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
  const [selectedToken, setSelectedToken] =
    useState<TokenWithTradeInfo>(DEGEN_TOKEN_METADATA);
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
          {perNFTPrice ? (
            <Text className="text-xs">
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 6,
              }).format(Number(perNFTPrice))}{" "}
              {selectedToken?.symbol} per NFT
            </Text>
          ) : (
            <Text className="text-xs text-secondary">calculating price...</Text>
          )}
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
          />
        ) : (
          <MintPriceBeforeGraduated
            tokenContract={nft.contractAddress}
            paymentToken={token}
            userSelectedToken={selectedToken}
            nftAmount={amount}
            setNftPrice={setNftPrice}
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
                onSuccess={onSuccess}
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
                amount={amount}
                nftPrice={nftPrice}
                onSuccess={onSuccess}
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
  paymentToken,
  userSelectedToken,
}: {
  tokenContract: `0x${string}`;
  nftAmount: number;
  setNftPrice: (price: bigint) => void;
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
      if (userSelectedToken?.address === paymentToken.address) {
        setNftPrice(nftPrice);
      } else {
        if (swapReady) fetchSellAmount(nftPrice);
      }
    }
  }, [nftPrice, swapReady, userSelectedToken]);

  useEffect(() => {
    console.log("nftPriceEth", nftPriceEth);
    if (nftPriceEth) setNftPrice(nftPriceEth);
  }, [nftPriceEth]);

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-medium">Total Cost</Text>
      {userSelectedToken?.address === paymentToken.address ? (
        nftPrice && paymentToken ? (
          <Text>
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 6,
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
  paymentToken,
  userSelectedToken,
}: {
  tokenContract: `0x${string}`;
  nftAmount: number;
  setNftPrice: (price: bigint) => void;
  paymentToken: TokenWithTradeInfo;
  userSelectedToken?: TokenWithTradeInfo;
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
  useEffect(() => {
    console.log("nftAmount", nftAmount, tokenUnit, swapReady);
    if (nftAmount && tokenUnit && swapReady)
      fetchSellAmount(BigInt(nftAmount) * BigInt(tokenUnit));
  }, [nftAmount, tokenUnit, swapReady]);
  const nftPrice = sellAmount
    ? sellAmount + sellAmount / 10n + sellAmount / 2000n //add 10% fee and 0.05% sliperage
    : undefined;
  useEffect(() => {
    if (nftPrice) setNftPrice(nftPrice);
  }, [nftPrice]);
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-lg font-medium">Total Cost</Text>
      {nftPrice && paymentToken ? (
        <Text>
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
          }).format(Number(formatUnits(nftPrice, paymentToken.decimals!)))}{" "}
          {paymentToken.symbol}
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
  amount,
  nftPrice,
  onSuccess,
  onError,
}: {
  nft: ERC42069Token;
  paymentToken: TokenWithTradeInfo;
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
      className="w-full"
      disabled={
        !nftPrice ||
        isPending ||
        Number(paymentToken?.rawBalance || 0) < Number(nftPrice)
      }
      onPress={() => {
        if (nftPrice && paymentToken) mint(amount, nftPrice);
      }}
    >
      <Text>{isPending ? "Confirming..." : "Mint"}</Text>
    </Button>
  );
}

function MintButtonAA({
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
  } = useATTFactoryContractMintAA(nft);

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
      className="w-full"
      disabled={
        !nftPrice ||
        isPending ||
        Number(paymentToken?.rawBalance || 0) < Number(nftPrice)
      }
      onPress={() => {
        if (nftPrice && paymentToken)
          mint(amount, nftPrice, paymentToken.address);
      }}
    >
      <Text>{isPending ? "Confirming..." : "Mint"}</Text>
    </Button>
  );
}

// export const ATT_TITLE = "About Proposal, upvote & channel NFT";
// export const ATT_INFO = [
//   "Propose: Turn a cast into a Channel NFT.",
//   "Approve: Approved proposal = Channel NFT.",
//   "Curators: After proposal is approved, top 10 upvoters(include proposer) = curators. The earlier the more revenue.",
//   "NFT transaction fee: Degencast 1%, Channel host 2%, Creator 3%, ,Curators 4%.",
//   "All Channel NFTs share a same channel bonding curve.",
//   "When channel bounding curve reaches a market cap of 4,206,900 DEGEN, all the liquidity will be deposited into Uniswap v3.",
//   "Channel NFT holders could claim airdrops after channel token launch.",
// ];
