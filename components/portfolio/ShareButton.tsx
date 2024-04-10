import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Text, View } from "react-native";
import { TokenInfoWithMetadata } from "~/services/user/types";
import { CommunityInfo } from "../common/CommunityInfo";
import NumberField from "../common/NumberField";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ToeknSelect from "./UserTokenSelect";
import {
  SHARE_ACTION,
  useShareContractBuy,
  useShareContractInfo,
  useShareContractSell,
} from "~/hooks/trade/useShareContract";
import { useAccount } from "wagmi";

export function SellButton({
  logo,
  name,
  sharesSubject,
}: {
  logo: string;
  name: string;
  sharesSubject: `0x${string}`;
}) {
  console.log("SellButton", sharesSubject);
  const account = useAccount();
  const { getPrice, getBalance } = useShareContractInfo(sharesSubject);
  const { data: balance } = getBalance(account?.address);
  const [amount, setAmount] = useState(0);
  const { data: price } = getPrice(SHARE_ACTION.SELL, amount, false);
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();
  const { sell, data, status, writeError, transationError, waiting, writing } =
    useShareContractSell(sharesSubject);
  console.log("SellButton", price, balance);

  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button className="w-14 bg-secondary">
          <Text className="text-xs font-bold text-secondary-foreground">
            Sell
          </Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="box-border w-screen text-primary-foreground">
        <DialogTitle className="text-md font-bold">Sell</DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo name={name} logo={logo} />
            <Text className="text-sm text-secondary">
              {Number(balance)} shares
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">
                Quantity
              </Text>
              <Text className="text-sm text-secondary">
                {Number(price)} DEGEN per share
              </Text>
            </View>
            <NumberField
              defaultValue={1}
              minValue={1}
              maxValue={Number(balance)}
              onChange={setAmount}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary-foreground">
              Receive:
            </Text>
            <Text className="text-md text-primary-foreground">
              {Number(amount) * Number(price)} DEGEN
            </Text>
          </View>
          <Button
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            disabled={waiting || writing}
            onPress={() => sell(amount)}
          >
            {waiting || writing ? "Confirming..." : "Sell"}
          </Button>
          {data?.transactionHash && <Text>Transaction Hash: {data?.transactionHash}</Text>}
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
  console.log("BuyButton", sharesSubject);
  const { getPrice, getSupply } = useShareContractInfo(sharesSubject);
  const { data: supply } = getSupply();
  const [amount, setAmount] = useState(0);
  const { data: price } = getPrice(SHARE_ACTION.BUY, amount, true);
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();
  const { buy, data, status, writeError, transationError, waiting, writing } =
    useShareContractBuy(sharesSubject);
  console.log("BuyButton", price, supply);
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Button className="w-14 bg-secondary">
          <Text className="text-xs font-bold text-secondary-foreground">
            Buy
          </Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="box-border w-screen text-primary-foreground">
        <DialogTitle className="text-md font-bold">
          Buy Shares & get allowance
        </DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo name={name} logo={logo} />
            <Text className="text-sm text-secondary">Capital Pool:</Text>
          </View>
          <ToeknSelect selectToken={setToken} />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">
                Quantity
              </Text>
              <Text className="text-xs text-secondary">
                {price as number} DEGEN per share
              </Text>
            </View>
            <NumberField
              defaultValue={1}
              minValue={1}
              maxValue={supply as number}
              onChange={setAmount}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary-foreground">
              Total Cost
            </Text>
            <Text className="text-md text-primary-foreground">
              {amount * Number(price)} DEGEN
            </Text>
          </View>
          <Button
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            disabled={waiting || writing}
            onPress={() => buy(amount)}
          >
            {waiting || writing ? "Confirming..." : "Buy"}
          </Button>
          {data?.transactionHash && <Text>Transaction Hash: {data?.transactionHash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}
