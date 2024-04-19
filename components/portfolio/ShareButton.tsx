import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { formatUnits } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
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
import { TokenInfoWithMetadata } from "~/services/user/types";
import { CommunityInfo } from "../common/CommunityInfo";
import NumberField from "../common/NumberField";
import ToeknSelect from "./UserTokenSelect";

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
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [amount, setAmount] = useState(1);
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();

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

  const balance = useMemo(() => {
    const { data } = getBalance(account?.address);
    return Number(data);
  }, [getBalance, account?.address, isSuccess]);
  const price = useMemo(() => {
    const { data } = getPrice(SHARE_ACTION.SELL, amount, true);
    return data as bigint;
  }, [amount, getPrice, isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Text>Sell</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen border-none">
        <DialogHeader>
          <DialogTitle>Sell</DialogTitle>
        </DialogHeader>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo name={name} logo={logo} />
            <Text className="text-sm">{balance} shares</Text>
          </View>
          <ToeknSelect
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
              maxValue={balance}
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
            disabled={waiting || writing || balance <= 0}
            onPress={() => sell(amount)}
          >
            <Text>{waiting || writing ? "Confirming..." : "Sell"}</Text>
          </Button>
          {data?.transactionHash && (
            <View className="flex gap-2">
              <Text className="font-bold">Transaction Hash:</Text>
              <Link
                className="text-foreground/80"
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
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [amount, setAmount] = useState(1);
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();

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

  const supply = useMemo(() => {
    const { data } = getSupply();
    return Number(data);
  }, [getSupply, isSuccess]);
  const price = useMemo(() => {
    const { data } = getPrice(SHARE_ACTION.BUY, amount, true);
    return data as bigint;
  }, [amount, getPrice, isSuccess]);

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
          <Button variant={"secondary"}>
            <Text>Buy</Text>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-screen border-none">
        <DialogHeader>
          <DialogTitle>Buy Shares & get allowance</DialogTitle>
        </DialogHeader>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo name={name} logo={logo} />
            <Text>Capital Pool: {supply}</Text>
          </View>
          <ToeknSelect
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
              waiting || writing || Number(token?.rawBalance) < Number(price)
            }
            onPress={() => buy(amount, price)}
          >
            <Text>{waiting || writing ? "Confirming..." : "Buy"}</Text>
          </Button>
          {data?.transactionHash && (
            <View className="flex gap-2">
              <Text className="font-bold">Transaction Hash:</Text>
              <Link
                className="text-foreground/80"
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
