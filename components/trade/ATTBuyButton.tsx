import * as Clipboard from "expo-clipboard";
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import Toast from "react-native-toast-message";
import { Address, formatUnits } from "viem";
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
import { Text } from "~/components/ui/text";
import { DEGEN_TOKEN_METADATA, NATIVE_TOKEN_ADDRESS, UNISWAP_V3_DEGEN_ETH_POOL_FEES } from "~/constants";
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
import { cn } from "~/lib/utils";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ERC42069Token, TokenWithTradeInfo } from "~/services/trade/types";
import { ONCHAIN_ACTION_TYPE } from "~/utils/platform-sharing/types";
import { shortPubKey } from "~/utils/shortPubKey";
import { TokenActivitieList } from "../activity/Activities";
import { Copy } from "../common/Icons";
import DialogTabBar from "../layout/tab-view/DialogTabBar";
import NeynarCastUserInfo from "../social-farcaster/proposal/NeynarCastUserInfo";
import ATTExternalLink from "./ATTExternalLink";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import UserTokenSelect from "./UserTokenSelect";

export type NFTProps = {
  cast?: NeynarCast;
  token: ERC42069Token;
};

export function BuyButton({
  token,
  cast,
  renderButton,
  onSuccess,
}: NFTProps & {
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
          cast={cast}
          open={open}
          onSuccess={onSuccess}
          setOpen={setOpen}
        />
      )}
    </Pressable>
  );
}

export const NftCtx = createContext<NFTProps | undefined>(undefined);

const useNftCtx = () => {
  const ctx = useContext(NftCtx);
  if (!ctx) {
    throw new Error("useCreateProposalCtx must be used within a provider");
  }
  return ctx;
};

export const DetailsScene = () => {
  const { token } = useNftCtx();
  const { tokenInfo } = useCurationTokenInfo(
    token.contractAddress,
    token.tokenId,
  );
  // console.log("DetailsScene", token, cast);
  return (
    <View className="relative h-full max-h-[80vh] gap-4 pt-4">
      <ScrollView
        className="flex-1"
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-2">
            <Text>Contract Address</Text>
            <View className="flex-row items-center justify-between gap-2">
              <Text className="line-clamp-1">
                {shortPubKey(token.contractAddress)}
              </Text>
              <Button
                size="icon"
                className="h-6 w-6 p-0"
                onPress={async (event) => {
                  await Clipboard.setStringAsync(
                    token.contractAddress as Address,
                  );
                  Toast.show({
                    type: "info",
                    text1: "Wallet Address Copied!",
                  });
                }}
              >
                <Copy className="size-4 text-white" />
              </Button>
            </View>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Token ID</Text>
            <Text> {token.tokenId} </Text>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Token Standard</Text>
            <Text>ERC-1155｜ERC-20</Text>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text>Chain</Text>
            <Text>{ATT_CONTRACT_CHAIN.name}</Text>
          </View>
          {tokenInfo?.channel?.lead && (
            <View className="flex-row items-center justify-between gap-2">
              <Text>Channel Host</Text>
              <NeynarCastUserInfo userData={tokenInfo.channel.lead} />
            </View>
          )}
          {tokenInfo?.cast?.author && (
            <View className="flex-row items-center justify-between gap-2">
              <Text>Cast Author</Text>
              <NeynarCastUserInfo userData={tokenInfo.cast.author} />
            </View>
          )}
          {tokenInfo?.curators && tokenInfo.curators.length > 0 && (
            <View className="flex-row items-start justify-between gap-2">
              <Text>Curators</Text>
              <View className="flex items-end gap-4">
                {tokenInfo.curators.map((curator, index) => (
                  <NeynarCastUserInfo key={index} userData={curator} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <ATTExternalLink
        contractAddress={token.contractAddress}
        tokenId={token.tokenId}
      />
    </View>
  );
};

export const ActivityScene = () => {
  const { token } = useNftCtx();
  return (
    <ScrollView
      className="max-h-[70vh] w-full"
      showsHorizontalScrollIndicator={false}
    >
      <TokenActivitieList token={token} />
    </ScrollView>
  );
};

export function BuyDialog({
  token,
  cast,
  open,
  setOpen,
  onSuccess,
}: NFTProps & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (mintNum: number) => void;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "nft", title: "NFT" },
    { key: "details", title: "Details" },
    { key: "activity", title: "Activity" },
  ]);

  const MintNFTScene = () => (
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
    </View>
  );

  const renderScene = SceneMap({
    nft: MintNFTScene,
    details: DetailsScene,
    activity: ActivityScene,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setTransationData(undefined);
        setError("");
        setOpen(o);
      }}
    >
      {!transationData && !error && (
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <NftCtx.Provider
            value={{
              cast,
              token,
            }}
          >
            <TabView
              swipeEnabled={false}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={DialogTabBar}
            />
          </NftCtx.Provider>
        </DialogContent>
      )}
      {transationData && (
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionInfo
            type={ONCHAIN_ACTION_TYPE.MINT_NFT}
            cast={cast}
            data={transationData}
            buttonText="Mint more"
            buttonAction={() => setTransationData(undefined)}
            navigateToCreatePageAfter={() => setOpen(false)}
          />
        </DialogContent>
      )}
      {error && (
        <DialogContent
          className="w-screen"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
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
  const { tokenInfo } = useCurationTokenInfo(
    nft.contractAddress,
    nft.tokenId,
  );
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
    if (!account || !maxTokensPerIdPerUser || !tokenInfo?.bondingCurve?.graduationNftNumber) return 0;
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
                maximumFractionDigits:
                  selectedToken.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
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
                userSelectedToken={selectedToken}
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
      className="w-full"
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
      <Text>{isPending ? "Confirming..." : "Mint"}</Text>
    </Button>
  );
}
