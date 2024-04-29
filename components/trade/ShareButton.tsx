import React, { ReactNode, forwardRef, useEffect, useState } from "react";
import { View } from "react-native";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { CommunityInfo } from "~/components/common/CommunityInfo";
import NumberField from "~/components/common/NumberField";
import { COMING_SOON_TAG } from "~/components/common/TextWithTag";
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
import { NATIVE_TOKEN_METADATA } from "~/constants";
import {
  SHARE_ACTION,
  SHARE_CONTRACT_CHAIN,
  SHARE_SUPPORT_TOKENS,
  useShareContractBuy,
  useShareContractInfo,
  useShareContractSell,
} from "~/hooks/trade/useShareContract";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import About from "../common/About";
import ActiveWallet from "./ActiveWallet";
import {
  ErrorInfo,
  TransactionSuccessInfo,
  TransationData,
} from "./TranasactionResult";
import ToeknSelect from "./UserTokenSelect";
import { TokenWithValue } from "../common/TokenInfo";

export function SellButton({
  logo,
  name,
  sharesSubject,
}: {
  logo?: string;
  name?: string;
  sharesSubject: `0x${string}`;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");
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
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Sell</DialogTitle>
            <ActiveWallet />
          </DialogHeader>
          <SellShare
            logo={logo}
            name={name}
            sharesSubject={sharesSubject}
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
          <TransactionSuccessInfo
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

const SellShare = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    logo?: string;
    name?: string;
    sharesSubject: `0x${string}`;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(
  (
    { className, logo, name, sharesSubject, onSuccess, onError, ...props },
    ref,
  ) => {
    const account = useAccount();
    const [amount, setAmount] = useState(1);
    const [token, setToken] = useState<TokenWithTradeInfo | undefined>();

    const { getBalance, getPrice } = useShareContractInfo(sharesSubject);
    const {
      sell,
      transactionReceipt,
      status,
      writeError,
      transationError,
      waiting,
      writing,
      isSuccess,
    } = useShareContractSell(sharesSubject);

    useEffect(() => {
      if (isSuccess && transactionReceipt && token && price) {
        const transationData = {
          transactionReceipt,
          description: (
            <View className="flex-row items-center gap-2">
              <Text className="text-white">
                Sell {amount} shares and receive
              </Text>
              <TokenWithValue token={token} value={price} />
            </View>
          ),
        };
        onSuccess?.(transationData);
      }
    }, [isSuccess]);

    useEffect(() => {
      if (writeError || transationError) {
        onError?.("Something Wrong!");
      }
    }, [writeError, transationError]);

    const { data: balance } = getBalance(account?.address);
    const { data: price } = getPrice(SHARE_ACTION.SELL, amount, true);
    return (
      <View className="flex gap-4">
        <View className="flex-row items-center justify-between">
          <CommunityInfo name={name} logo={logo} />
          <Text className="text-sm">{Number(balance)} shares</Text>
        </View>
        <ToeknSelect
          hidden
          chain={SHARE_CONTRACT_CHAIN}
          supportTokenKeys={SHARE_SUPPORT_TOKENS}
          selectToken={setToken}
        />
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold">Quantity</Text>
            {price && amount && token && token.decimals ? (
              <Text className="text-xs">
                {formatUnits(price / BigInt(amount), token.decimals)}
                {token?.symbol} per share
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
          <Text className="text-lg font-bold">Receive:</Text>
          {price && amount && token && token.decimals ? (
            <Text className="text-md">
              {formatUnits(price, token.decimals)} {token.symbol}
            </Text>
          ) : (
            <Text className="text-md">fetching price...</Text>
          )}
        </View>
        <Button
          variant={"secondary"}
          className="w-full"
          disabled={!account || waiting || writing || balance <= 0}
          onPress={() => sell(amount)}
        >
          <Text>{waiting || writing ? "Confirming..." : "Sell"}</Text>
        </Button>
      </View>
    );
  },
);

export function BuyButton({
  logo,
  name,
  sharesSubject,
  renderButton,
}: {
  logo?: string;
  name?: string;
  sharesSubject: `0x${string}`;
  renderButton?: () => React.ReactElement;
}) {
  const [transationData, setTransationData] = useState<TransationData>();
  const [error, setError] = useState("");

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
          <DialogHeader className={cn("flex gap-2")}>
            <DialogTitle>Buy Shares & get allowance</DialogTitle>
            <ActiveWallet />
          </DialogHeader>
          <BuyShare
            logo={logo}
            name={name}
            sharesSubject={sharesSubject}
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
          <TransactionSuccessInfo
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

const BuyShare = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    logo?: string;
    name?: string;
    sharesSubject: `0x${string}`;
    onSuccess?: (data: TransationData) => void;
    onError?: (error: string) => void;
  }
>(
  (
    { className, logo, name, sharesSubject, onSuccess, onError, ...props },
    ref,
  ) => {
    const account = useAccount();
    const [amount, setAmount] = useState(1);
    const [token, setToken] = useState<TokenWithTradeInfo | undefined>();

    const { getPrice, getSupply } = useShareContractInfo(sharesSubject);
    const {
      buy,
      transactionReceipt,
      status,
      writeError,
      transationError,
      waiting,
      writing,
      isSuccess,
    } = useShareContractBuy(sharesSubject);

    const { data: supply } = getSupply();
    const { data: price } = getPrice(SHARE_ACTION.BUY, amount, true);

    const fetchedPrice = !!(price && amount && token && token.decimals);
    const perSharePrice = fetchedPrice
      ? formatUnits(price / BigInt(amount), token.decimals!)
      : "";
    const symbol = token?.symbol || "";

    useEffect(() => {
      if (isSuccess && transactionReceipt && token && price) {
        const transationData = {
          transactionReceipt,
          description: (
            <View className="flex-row items-center gap-2">
              <Text>Buy {amount} shares and cost</Text>
              <TokenWithValue token={token} value={price} />
            </View>
          ),
        };
        onSuccess?.(transationData);
      }
    }, [isSuccess]);

    useEffect(() => {
      if (writeError || transationError) {
        onError?.("Something Wrong!");
      }
    }, [writeError, transationError]);

    return (
      <View className="flex gap-4">
        <View className="flex-row items-center justify-between">
          <CommunityInfo name={name} logo={logo} />
          <Text>Capital Pool: {Number(supply)}</Text>
        </View>
        <ToeknSelect
          hidden
          chain={SHARE_CONTRACT_CHAIN}
          supportTokenKeys={SHARE_SUPPORT_TOKENS}
          selectToken={setToken}
        />
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold">Quantity</Text>
            {fetchedPrice ? (
              <Text className="text-xs">
                {perSharePrice}
                {symbol} per share
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
          <Text className="text-lg font-bold">Total Cost</Text>
          {fetchedPrice ? (
            <Text>
              {formatUnits(price, token.decimals!)} {token.symbol}
            </Text>
          ) : (
            <Text>fetching price...</Text>
          )}
        </View>
        <Button
          variant={"secondary"}
          className="w-full"
          disabled={
            !account ||
            waiting ||
            writing ||
            Number(token?.rawBalance) < Number(price)
          }
          onPress={() => buy(amount, price)}
        >
          <Text>{waiting || writing ? "Confirming..." : "Buy"}</Text>
        </Button>
      </View>
    );
  },
);

export const SHARE_TITLE = "About Channel Share";
export const SHARE_INFO = [
  `Share holders could claim airdrops after channel token launch ${COMING_SOON_TAG}`,
  `Share holders could receive channel allowance (same as your Degen allowance) ${COMING_SOON_TAG}`,
  "The price of channel shares will increase after each buy",
  "4% of each trade goes into capital pool to support channel rewards, and Degencast takes a 1% commission",
];

// export const BuyButtonWithPrice = forwardRef<
//   React.ElementRef<typeof Button>,
//   React.ComponentPropsWithoutRef<typeof Button> & {
//     token?: TokenWithTradeInfo;
//     amount?: number;
//     sharesSubject: `0x${string}`;
//   }
// >(({ sharesSubject, token = NATIVE_TOKEN_METADATA, amount = 1 }, ref) => {
//   const { getPrice } = useShareContractInfo(sharesSubject);
//   const { data: price } = getPrice(SHARE_ACTION.BUY, amount, true);
//   const fetchedPrice = !!(price && amount && token && token.decimals);
//   const perSharePrice = fetchedPrice
//     ? formatUnits(price / BigInt(amount), token.decimals!)
//     : "";
//   const symbol = token?.symbol || "";

//   return (
//     <Button
//       variant={"secondary"}
//       className={cn(" flex-col items-center ")}
//       ref={ref}
//     >
//       {fetchedPrice ? (
//         <>
//           <Text>Buy with </Text>
//           <Text>
//             {perSharePrice} {symbol}
//           </Text>
//         </>
//       ) : (
//         <Text> Fetching Price... </Text>
//       )}
//     </Button>
//   );
// });

export const BuyButtonWithPrice = ({
  sharesSubject,
  token = NATIVE_TOKEN_METADATA,
  amount = 1,
}: {
  sharesSubject: `0x${string}`;
  token?: TokenWithTradeInfo;
  amount?: number;
}) => {
  const { getPrice } = useShareContractInfo(sharesSubject);
  const { data: price } = getPrice(SHARE_ACTION.BUY, amount, true);
  const fetchedPrice = !!(price && amount && token && token.decimals);
  const perSharePrice = fetchedPrice
    ? formatUnits(price / BigInt(amount), token.decimals!)
    : "";
  const symbol = token?.symbol || "";

  return (
    <Button
      variant={"secondary"}
      className={cn(" flex-col items-center ")}
    >
      {fetchedPrice ? (
        <>
          <Text>Buy with </Text>
          <Text>
            {perSharePrice} {symbol}
          </Text>
        </>
      ) : (
        <Text> Fetching Price... </Text>
      )}
    </Button>
  );
};
