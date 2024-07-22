import React, { forwardRef, useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import NumberField from "~/components/common/NumberField";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTFactoryContractBuy,
  useATTFactoryContractInfo,
  useATTFactoryContractSell,
} from "~/hooks/trade/useATTFactoryContract";
import { getTokenInfo } from "~/hooks/trade/useERC20Contract";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { cn } from "~/lib/utils";
import { createToken } from "~/services/trade/api";
import { TokenWithTradeInfo } from "~/services/trade/types";
import About from "../common/About";
import { TokenWithValue } from "../common/TokenInfo";
import UserWalletSelect from "../portfolio/tokens/UserWalletSelect";
import { AspectRatio } from "../ui/aspect-ratio";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import { Separator } from "../ui/separator";

export function SellButton({
  tokenAddress,
  tokenId,
}: {
  tokenAddress: Address;
  tokenId: number;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  const [showDetails, setShowDetails] = useState(false);
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={() => connectWallet()}
      >
        <Text>Sell</Text>
      </Button>
    );
  else
    return (
      <Dialog
        onOpenChange={() => {
          setTransationData(undefined);
          setError("");
        }}
      >
        <DialogTrigger asChild>
          <Button className={cn("w-14")} size="sm" variant={"secondary"}>
            <Text>Sell</Text>
          </Button>
        </DialogTrigger>
        {!transationData && !error && (
          <DialogContent className="w-screen">
            <DialogHeader className={cn("mr-4 flex-row items-center")}>
              <Pressable
                disabled={!showDetails}
                onPress={() => setShowDetails(false)}
              >
                <Text className={showDetails ? "text-secondary" : "text-white"}>
                  Mint Channel NFT
                </Text>
              </Pressable>
              <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
              <Pressable
                disabled={showDetails}
                onPress={() => setShowDetails(true)}
              >
                <Text
                  className={!showDetails ? "text-secondary" : "text-white"}
                >
                  Details
                </Text>
              </Pressable>
            </DialogHeader>
            {showDetails ? (
              <Details tokenAddress={tokenAddress} tokenId={tokenId} />
            ) : (
              <>
                <View className="flex-row items-center justify-between gap-2">
                  <Text>Active Wallet</Text>
                  <UserWalletSelect />
                </View>
                <Sell
                  tokenAddress={tokenAddress}
                  tokenId={tokenId}
                  onSuccess={setTransationData}
                  onError={setError}
                />
              </>
            )}
          </DialogContent>
        )}
        {transationData && (
          <DialogContent className="w-screen">
            <DialogHeader className={cn("flex gap-2")}>
              <DialogTitle>Transaction</DialogTitle>
            </DialogHeader>
            <TransactionInfo
              data={transationData}
              buttonText="Sell more"
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

const Sell = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    tokenAddress: Address;
    tokenId: number;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, tokenAddress, tokenId, onSuccess, onError, ...props }, ref) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);

  const {
    sell,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useATTFactoryContractSell(tokenAddress, tokenId);

  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text className="text-white">Sell {amount} badges and receive</Text>
            <TokenWithValue token={token} value={nftPrice} />
          </View>
        ),
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

  const { nftBalanceOf } = useATTContractInfo(tokenAddress, tokenId);
  const { data: balance } = nftBalanceOf(account?.address);

  const { getBurnNFTPriceAfterFee, getPaymentToken } =
    useATTFactoryContractInfo(tokenAddress);

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
  const { nftPrice } = getBurnNFTPriceAfterFee(amount);
  return (
    <View className="flex gap-4">
      <NFTImage tokenAddress={tokenAddress} tokenId={tokenId} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {nftPrice && amount && token && token.decimals ? (
            <Text className="text-xs">
              {formatUnits(nftPrice / BigInt(amount), token.decimals)}
              {token?.symbol} per badge
            </Text>
          ) : (
            <Text className="text-xs">calculating price...</Text>
          )}
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
        {nftPrice && amount && token && token.decimals ? (
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
            className="w-full"
            disabled={!account || waiting || writing || !balance}
            onPress={() => sell(amount)}
          >
            <Text>{waiting || writing ? "Confirming..." : "Sell"}</Text>
          </Button>
        }
      />
    </View>
  );
});

export function BuyButton({
  tokenAddress,
  tokenId,
  renderButton,
}: {
  tokenAddress: Address;
  tokenId: number;
  renderButton?: (props: { onPress: () => void }) => React.ReactNode;
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
          <Text>Buy</Text>
        </Button>
      )}

      {account.address && (
        <BuyDialog
          tokenAddress={tokenAddress}
          tokenId={tokenId}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </Pressable>
  );
}

export function BuyDialog({
  tokenAddress,
  tokenId,
  open,
  onOpenChange,
}: {
  tokenAddress: Address;
  tokenId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
                Mint Channel NFT
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
          {showDetails ? (
            <Details tokenAddress={tokenAddress} tokenId={tokenId} />
          ) : (
            <>
              <View className="flex-row items-center justify-between gap-2">
                <Text>Active Wallet</Text>
                <UserWalletSelect />
              </View>
              <Buy
                tokenAddress={tokenAddress}
                tokenId={tokenId}
                onSuccess={setTransationData}
                onError={setError}
              />
              <DialogFooter>
                <About title={SHARE_TITLE} info={SHARE_INFO} />
              </DialogFooter>
            </>
          )}
        </DialogContent>
      )}
      {transationData && (
        <DialogContent className="w-screen">
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Transaction</DialogTitle>
          </DialogHeader>
          <TransactionInfo
            data={transationData}
            buttonText="Buy more"
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

const Buy = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    tokenAddress: Address;
    tokenId: number;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(({ className, tokenAddress, tokenId, onSuccess, onError, ...props }, ref) => {
  const account = useAccount();
  const [amount, setAmount] = useState(1);
  const {
    buy,
    transactionReceipt,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useATTFactoryContractBuy(tokenAddress, tokenId);

  const { getMintNFTPriceAfterFee, getPaymentToken } =
    useATTFactoryContractInfo(tokenAddress);

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
  const { nftPrice } = getMintNFTPriceAfterFee(amount);
  const fetchedPrice = !!(nftPrice && amount && token && token.decimals);
  const perBadgePrice = fetchedPrice
    ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
    : "";
  // console.log("fetchedPrice", fetchedPrice, nftPrice, amount, token);
  useEffect(() => {
    if (isSuccess && transactionReceipt && token && nftPrice) {
      const transationData = {
        chain: ATT_CONTRACT_CHAIN,
        transactionReceipt,
        description: (
          <View className="flex-row items-center gap-2">
            <Text>Buy {amount} badges and cost</Text>
            <TokenWithValue token={token} value={nftPrice} />
          </View>
        ),
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
      <NFTImage tokenAddress={tokenAddress} tokenId={tokenId} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-medium">Quantity</Text>
          {fetchedPrice ? (
            <Text className="text-xs">
              {perBadgePrice}
              {token?.symbol} per badge
            </Text>
          ) : (
            <Text className="text-xs text-secondary">calculating price...</Text>
          )}
        </View>
        <NumberField defaultValue={1} minValue={1} onChange={setAmount} />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-medium">Total Cost</Text>
        {fetchedPrice && nftPrice ? (
          <Text>
            {formatUnits(nftPrice, token.decimals!)} {token.symbol}
          </Text>
        ) : (
          <Text>fetching price...</Text>
        )}
      </View>
      <OnChainActionButtonWarper
        variant="secondary"
        className="w-full"
        targetChainId={ATT_CONTRACT_CHAIN.id}
        allowanceParams={allowanceParams}
        warpedButton={
          <Button
            variant="secondary"
            className="w-full"
            disabled={
              !account ||
              !nftPrice ||
              waiting ||
              writing ||
              Number(token?.rawBalance || 0) < Number(nftPrice)
            }
            onPress={() => {
              if (nftPrice)
                buy(amount, nftPrice);
            }}
          >
            <Text>{waiting || writing ? "Confirming..." : "Buy"}</Text>
          </Button>
        }
      />
    </View>
  );
});

export const SHARE_TITLE = "About channel badge";
export const SHARE_INFO = [
  "When the channel badge bounding curve reaches a market cap of $42,069, all the liquidity will be deposited into Uniswap v3",
  "4% of each trade goes into channel reward pool to support channel rewards, and Degencast takes a 1% commission",
  "Badge holders could claim airdrops after channel token launch",
  "Buy channel badges to earn 500 $CAST point",
];

export function CreateTokenButton({
  channelId,
  onComplete,
}: {
  channelId: string;
  onComplete: (tokenAddress: Address) => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="w-14"
      size="sm"
      variant="secondary"
      disabled={loading}
      onPress={async () => {
        setLoading(true);
        const resp = await createToken(channelId);
        console.log(resp);
        const attentionTokenAddr = resp.data?.data?.dn42069TokenAddress;
        if (attentionTokenAddr) {
          Toast.show({
            type: "success",
            text1: "Token Created",
            text2: "You can now trade your token",
          });
          onComplete(resp.data.data.dn42069TokenAddress);
        } else {
          Toast.show({
            type: "error",
            text1: "Token Creation Failed",
            text2: "Please try again later",
          });
          setLoading(false);
          return;
        }
      }}
    >
      <Text>Create</Text>
    </Button>
  );
}

function NFTImage({
  tokenAddress,
  tokenId,
  image = "https://arseed.web3infra.dev/JVOOPz-rL_4jaSpcpQF8PEshFrpmXtHIi9L3bvzHhHM", //todo delete the default image
}: {
  tokenAddress: Address;
  tokenId: number;
  image?: string;
}) {
  const { uri } = useATTContractInfo(tokenAddress, tokenId);
  const { data: tokenURI } = uri();
  const [imageURI, setimageURI] = useState("");

  useEffect(() => {
    // console.log("tokenURI", tokenAddress, tokenId, tokenURI, image);
    if (image) {
      setimageURI(image);
    } else if (tokenURI) {
      fetch(tokenURI)
        .then((response) => response.json())
        .then((json) => json.image as string)
        .catch((err) => console.log("Request NFT Metadata Failed", err));
    }
  }, [tokenURI, image]);

  return (
    <AspectRatio ratio={1}>
      <Image
        source={{
          uri: imageURI,
        }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          resizeMode: "contain",
        }}
      />
    </AspectRatio>
  );
}

function Details({
  tokenAddress,
  tokenId,
}: {
  tokenAddress: Address;
  tokenId: number;
}) {
  return (
    <View>
      <Text>
        Details of {tokenAddress} No. {tokenId}
      </Text>
    </View>
  );
}
