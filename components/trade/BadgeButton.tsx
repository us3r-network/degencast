import { useConnectWallet } from "@privy-io/react-auth";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CommunityInfo } from "~/components/common/CommunityInfo";
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
  BADGE_PAYMENT_TOKEN,
} from "~/constants/att";
import { useATTContractInfo } from "~/hooks/trade/useATTContract";
import {
  useATTFactoryContractBuy,
  useATTFactoryContractInfo,
  useATTFactoryContractSell,
} from "~/hooks/trade/useATTFactoryContract";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import About from "../common/About";
import { TokenWithValue } from "../common/TokenInfo";
import UserWalletSelect from "../portfolio/tokens/UserWalletSelect";
import {
  ErrorInfo,
  TransactionInfo,
  TransationData,
} from "./TranasactionResult";
import OnChainActionButtonWarper from "./OnChainActionButtonWarper";
import { useUserToken } from "~/hooks/user/useUserTokens";
import { createToken } from "~/services/trade/api";
import Toast from "react-native-toast-message";

export function SellButton({
  logo,
  name,
  tokenAddress,
}: {
  logo?: string;
  name?: string;
  tokenAddress: Address;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={connectWallet}
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
            <DialogHeader
              className={cn("mr-4 flex-row items-center justify-between gap-2")}
            >
              <DialogTitle>Sell</DialogTitle>
            </DialogHeader>
            <View className="flex-row items-center justify-between gap-2">
              <Text>Active Wallet</Text>
              <UserWalletSelect />
            </View>
            <SellBadge
              logo={logo}
              name={name}
              tokenAddress={tokenAddress}
              onSuccess={setTransationData}
              onError={setError}
            />
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

const SellBadge = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    logo?: string;
    name?: string;
    tokenAddress: Address;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(
  (
    { className, logo, name, tokenAddress, onSuccess, onError, ...props },
    ref,
  ) => {
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
    } = useATTFactoryContractSell(tokenAddress);

    useEffect(() => {
      if (isSuccess && transactionReceipt && token && nftPrice) {
        const transationData = {
          chain: ATT_CONTRACT_CHAIN,
          transactionReceipt,
          description: (
            <View className="flex-row items-center gap-2">
              <Text className="text-white">
                Sell {amount} badges and receive
              </Text>
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

    const { getNFTBalance } = useATTContractInfo(tokenAddress);
    const { data: balance } = getNFTBalance(account?.address);

    const { getBurnNFTPriceAfterFee, getPaymentToken } =
      useATTFactoryContractInfo(tokenAddress);

    // const { paymentTokenInfo: token } = getPaymentToken();
    const token = BADGE_PAYMENT_TOKEN;

    const { nftPrice } = getBurnNFTPriceAfterFee(amount);
    return (
      <View className="flex gap-4">
        <View className="flex-row items-center justify-between">
          <CommunityInfo name={name} logo={logo} />
          <Text className="text-sm">{balance} badges</Text>
        </View>
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
            maxValue={balance}
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
  },
);

export function BuyButton({
  logo,
  name,
  tokenAddress,
  renderButton,
}: {
  logo?: string;
  name?: string;
  tokenAddress: Address;
  renderButton?: () => React.ReactElement;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (!account.address)
    return (
      <Button
        className={cn("w-14")}
        size="sm"
        variant={"secondary"}
        onPress={connectWallet}
      >
        <Text>Buy</Text>
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
          {renderButton ? (
            renderButton()
          ) : (
            <Button className={cn("w-14")} size="sm" variant={"secondary"}>
              <Text>Buy</Text>
            </Button>
          )}
        </DialogTrigger>
        {!transationData && !error && (
          <DialogContent className="w-screen">
            <DialogHeader
              className={cn("mr-4 flex-row items-center justify-between gap-2")}
            >
              <DialogTitle>Buy Badges & get allowance</DialogTitle>
            </DialogHeader>
            <View className="flex-row items-center justify-between gap-2">
              <Text>Active Wallet</Text>
              <UserWalletSelect />
            </View>
            <BuyBadge
              logo={logo}
              name={name}
              tokenAddress={tokenAddress}
              onSuccess={setTransationData}
              onError={setError}
            />
            <DialogFooter>
              <About title={SHARE_TITLE} info={SHARE_INFO} />
            </DialogFooter>
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

const BuyBadge = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    logo?: string;
    name?: string;
    tokenAddress: Address;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(
  (
    { className, logo, name, tokenAddress, onSuccess, onError, ...props },
    ref,
  ) => {
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
    } = useATTFactoryContractBuy(tokenAddress);

    const { getNFTBalance } = useATTContractInfo(tokenAddress);
    const { data: balance } = getNFTBalance(account?.address);

    const { getMintNFTPriceAfterFee, getPaymentToken } =
      useATTFactoryContractInfo(tokenAddress);

    // const { paymentToken } = getPaymentToken();
    const token = useUserToken(
      account?.address,
      BADGE_PAYMENT_TOKEN.address,
      ATT_CONTRACT_CHAIN.id,
    );

    const { nftPrice, adminFee } = getMintNFTPriceAfterFee(amount);
    const fetchedPrice = !!(nftPrice && amount && token && token.decimals);
    const perBadgePrice = fetchedPrice
      ? formatUnits(nftPrice / BigInt(amount), token.decimals!)
      : "";

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
      account?.address && token?.address && nftPrice && adminFee !== undefined
        ? {
            owner: account.address,
            tokenAddress: token?.address,
            spender: ATT_FACTORY_CONTRACT_ADDRESS,
            value: nftPrice + adminFee,
          }
        : undefined;
    return (
      <View className="flex gap-4">
        <View className="flex-row items-center justify-between">
          <CommunityInfo name={name} logo={logo} />
          <Text>{balance}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-medium">Quantity</Text>
            {fetchedPrice ? (
              <Text className="text-xs">
                {perBadgePrice}
                {token?.symbol} per badge
              </Text>
            ) : (
              <Text className="text-xs text-secondary">
                calculating price...
              </Text>
            )}
          </View>
          <NumberField defaultValue={1} minValue={1} onChange={setAmount} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Total Cost</Text>
          {fetchedPrice && nftPrice && adminFee !== undefined ? (
            <Text>
              {formatUnits(nftPrice + adminFee, token.decimals!)} {token.symbol}
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
                if (nftPrice && adminFee !== undefined)
                  buy(amount, nftPrice + adminFee);
              }}
            >
              <Text>{waiting || writing ? "Confirming..." : "Buy"}</Text>
            </Button>
          }
        />
      </View>
    );
  },
);

export const SHARE_TITLE = "About channel badge";
export const SHARE_INFO = [
  "When the channel badge bounding curve reaches a market cap of $42,069, all the liquidity will be deposited into Uniswap v3",
  "4% of each trade goes into channel reward pool to support channel rewards, and Degencast takes a 1% commission",
  "Badge holders could claim airdrops after channel token launch",
  "Buy channel badges to earn 500 $CAST point",
];

export function LaunchButton({
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
        const attentionTokenAddr = resp.data?.data?.attentionTokenAddr;
        if (attentionTokenAddr) {
          Toast.show({
            type: "success",
            text1: "Token Created",
            text2: "You can now trade your token",
          });
          onComplete(resp.data.data.attentionTokenAddr);
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
      <Text>Launch</Text>
    </Button>
  );
}
