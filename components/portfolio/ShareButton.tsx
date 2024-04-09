import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Text, View } from "react-native";
import { TokenInfoWithMetadata } from "~/services/user/types";
import { CommunityInfo } from "../common/CommunityInfo";
import NumberField from "../common/NumberField";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "../ui/dialog";
import ToeknSelect from "./UserTokenSelect";

export function SellButton({
  logo,
  name,
  assetId,
}: {
  logo: string;
  name: string;
  assetId: number;
}) {
  console.log("SellButton assetId", assetId);
  const balance = 2;
  const price = 4723;
  const [amount, setAmount] = useState("0");
  const isPending = false;
  const hash = "";
  const sell = async () => {
    console.log("sell", amount);
  };
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
            <Text className="text-sm text-secondary">{balance} shares</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">Quantity</Text>
              <Text className="text-sm text-secondary">
                {price} DEGEN per share
              </Text>
            </View>
            <NumberField defaultValue={1} minValue={1} maxValue={balance} />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary-foreground">Receive:</Text>
            <Text className="text-md text-primary-foreground">
              {Number(amount) * price} DEGEN
            </Text>
          </View>
          <Button
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            disabled={isPending}
            onPress={sell}
          >
            {isPending ? "Confirming..." : "Sell"}
          </Button>
          {hash && <Text>Transaction Hash: {hash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}

export function BuyButton({
  logo,
  name,
  assetId,
}: {
  logo?: string;
  name?: string;
  assetId: number;
}) {
  console.log("SellButton assetId", assetId);
  const balance = 2;
  const price = 4723;
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();
  const isPending = false;
  const hash = "";
  const buy = async () => {
    console.log("buy", token, amount);
  };
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
        <DialogTitle className="text-md font-bold">Buy Shares & get allowance</DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <CommunityInfo name={name} logo={logo} />
            <Text className="text-sm text-secondary">Capital Pool:</Text>
          </View>
          <ToeknSelect selectToken={setToken} />
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-primary-foreground">Quantity</Text>
              <Text className="text-xs text-secondary">
                {price} DEGEN per share
              </Text>
            </View>
            <NumberField defaultValue={1} minValue={1} maxValue={balance} />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-primary-foreground">Total Cost</Text>
            <Text className="text-md text-primary-foreground">
              {Number(amount) * price} DEGEN
            </Text>
          </View>
          <Button
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            disabled={isPending}
            onPress={buy}
          >
            {isPending ? "Confirming..." : "Buy"}
          </Button>
          {hash && <Text>Transaction Hash: {hash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}
