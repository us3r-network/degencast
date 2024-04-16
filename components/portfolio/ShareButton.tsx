import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { formatUnits } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
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
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Text>Sell</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="box-border w-screen text-primary-foreground">
        <DialogTitle className="text-md font-bold">Sell</DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo
              name={name}
              logo={logo}
              textClassName="text-primary-foreground"
            />
            <Text className="text-sm text-secondary">{balance} shares</Text>
          </View>
          <ToeknSelect
            chain={SHARE_CONTRACT_CHAIN}
            supportTokenKeys={SHARE_SUPPORT_TOKENS}
            selectToken={setToken}
          />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">
                Quantity
              </Text>
              {price && amount && token && token.decimals ? (
                <Text className="text-xs text-secondary">
                  {formatUnits(price / BigInt(amount), token.decimals)}
                  {token?.symbol} per share
                </Text>
              ) : (
                <Text className="text-xs text-secondary">
                  calculating price...
                </Text>
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
            <Text className="text-lg font-bold text-primary-foreground">
              Receive:
            </Text>
            {price && amount && token && token.decimals ? (
              <Text className="text-md text-primary-foreground">
                {formatUnits(price, token.decimals)} {token.symbol}
              </Text>
            ) : (
              <Text className="text-md text-primary-foreground">
                fetching price...
              </Text>
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
            <View>
              <Text className="font-bold text-white">
                Transaction Hash:
                <Link
                  className="text-white"
                  href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${data?.transactionHash}`}
                  target="_blank"
                >
                  {data?.transactionHash}
                </Link>
              </Text>
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
}: {
  logo?: string;
  name?: string;
  sharesSubject: `0x${string}`;
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

  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <Text>Buy</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="box-border w-screen text-primary-foreground">
        <DialogTitle className="text-md font-bold">
          Buy Shares & get allowance
        </DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo
              name={name}
              logo={logo}
              textClassName="text-primary-foreground"
            />
            <Text className="text-sm text-secondary">
              Capital Pool: {supply}
            </Text>
          </View>
          <ToeknSelect
            chain={SHARE_CONTRACT_CHAIN}
            supportTokenKeys={SHARE_SUPPORT_TOKENS}
            selectToken={setToken}
          />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">
                Quantity
              </Text>
              {price && amount && token && token.decimals ? (
                <Text className="text-xs text-secondary">
                  {formatUnits(price / BigInt(amount), token.decimals)}
                  {token?.symbol} per share
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
            <Text className="text-lg font-bold text-primary-foreground">
              Total Cost
            </Text>
            {price && amount && token && token.decimals ? (
              <Text className="text-md text-primary-foreground">
                {formatUnits(price, token.decimals)} {token.symbol}
              </Text>
            ) : (
              <Text className="text-md text-primary-foreground">
                fetching price...
              </Text>
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
            <View>
              <Text className="font-bold text-white">
                Transaction Hash:
                <Link
                  className="text-white"
                  href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${data?.transactionHash}`}
                  target="_blank"
                >
                  {data?.transactionHash}
                </Link>
              </Text>
            </View>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
}
