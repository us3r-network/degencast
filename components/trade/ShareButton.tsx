import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
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
import { CommunityInfo } from "~/components/common/CommunityInfo";
import NumberField from "~/components/common/NumberField";
import ToeknSelect from "./UserTokenSelect";
import ActiveWallet from "./ActiveWallet";
import { COMING_SOON_TAG } from "~/components/common/TextWithTag";

export function SellButton({
  logo,
  name,
  sharesSubject,
}: {
  logo?: string;
  name?: string;
  sharesSubject: `0x${string}`;
}) {
  const account = useAccount();
  const [amount, setAmount] = useState(1);
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();

  const { getBalance, getPrice } = useShareContractInfo(sharesSubject);
  const {
    sell,
    data,
    status,
    writeError,
    transationError,
    waiting,
    writing,
    isSuccess,
  } = useShareContractSell(sharesSubject);

  const { data: balance } = getBalance(account?.address);
  const { data: price } = getPrice(SHARE_ACTION.SELL, amount, true);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("w-14")} size="sm" variant={"secondary"}>
          <Text>Sell</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader className={cn("flex gap-2")}>
          <DialogTitle>Sell</DialogTitle>
          <ActiveWallet />
        </DialogHeader>
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
          {data?.transactionHash && (
            <View className="flex gap-2">
              <Text className="font-bold">Transaction Hash:</Text>
              <Link
                className="text-primary-foreground/80"
                href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${data?.transactionHash}`}
                target="_blank"
              >
                {data?.transactionHash}
              </Link>
            </View>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
}

export function BuyButton({
  logo,
  name,
  sharesSubject,
  renderButton,
}: {
  logo?: string;
  name?: string;
  sharesSubject: `0x${string}`;
  renderButton?: (props: {
    fetchedPrice: boolean;
    perSharePrice: string;
    symbol: string;
  }) => React.ReactElement;
}) {
  const account = useAccount();
  const [amount, setAmount] = useState(1);
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();

  const { getPrice, getSupply } = useShareContractInfo(sharesSubject);
  const {
    buy,
    data,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {renderButton ? (
          renderButton({ fetchedPrice, perSharePrice, symbol })
        ) : (
          <Button className={cn("w-14")} size="sm" variant={"secondary"}>
            <Text>Buy</Text>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader className={cn("flex gap-2")}>
          <DialogTitle>Buy Shares & get allowance</DialogTitle>
          <ActiveWallet />
        </DialogHeader>
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
          {data?.transactionHash && (
            <View className="flex gap-2">
              <Text className="font-bold">Transaction Hash:</Text>
              <Link
                className="text-primary-foreground/80"
                href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${data?.transactionHash}`}
                target="_blank"
              >
                {data?.transactionHash}
              </Link>
            </View>
          )}
        </View>
        <DialogFooter>
          <About title={SHARE_TITLE} info={SHARE_INFO} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const SHARE_TITLE = "About Channel Share";
export const SHARE_INFO = [
  `Share holders could claim airdrops after channel token launch ${COMING_SOON_TAG}`,
  `Share holders could receive channel allowance (same as your Degen allowance) ${COMING_SOON_TAG}`,
  "The price of channel shares will increase after each buy",
  "4% of each trade goes into capital pool to support channel rewards, and Degencast takes a 1% commission",
];
