import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { useState } from "react";
// import { clientToSigner } from '@/utils/ethers';
import { Pressable, Text, TextInput, View } from "react-native";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import { base } from "viem/chains";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { OwnedToken, Wallet } from "alchemy-sdk";
import { MinusCircle } from "lucide-react-native";
import { shortPubKey } from "~/utils/shortPubKey";
import { TokenInfo } from "./tokens/TokenInfo";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";
export default function SendButton({
  defaultAddress,
  defaultChain = base.id,
  tokens,
}: {
  defaultAddress: `0x${string}`;
  defaultChain?: number;
  tokens: OwnedToken[];
}) {
  const [address, setAddress] = useState(defaultAddress);
  const [amount, setAmount] = useState("1");
  const [token, setToken] = useState<OwnedToken | undefined>(
    tokens?.length > 0 ? tokens[0] : undefined,
  );
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const send = async () => {
    console.log("Send", { address, amount, token });
    sendTransaction({ to: address, value: parseEther(amount) });
  };
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Pressable>
          <Text className="font-bold text-secondary">Send</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className="w-[400px] text-primary-foreground">
        <DialogTitle className="text-md font-bold">Send</DialogTitle>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">
              Wallet address
            </Text>
            <Text className="text-sm text-secondary">Only sending on Base</Text>
          </View>
          <TextInput
            className="w-full rounded-md border border-secondary p-2"
            placeholder="Enter wallet address"
            value={address}
            onChangeText={(newText) => setAddress(newText as `0x${string}`)}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">Token</Text>
          </View>
          <Select
            defaultValue={{
              value: token?.contractAddress || "",
              label: token?.name || "",
            }}
            onValueChange={async (item) => {
              const newToken = tokens.find(
                (token) => token.contractAddress === item?.value,
              );
              if (newToken) setToken(newToken);
            }}
          >
            <SelectTrigger className="w-full">
              {token && (
                <View className="w-full flex-row items-center justify-between">
                  <TokenInfo {...token} />
                  <Text>{token?.balance} available</Text>
                </View>
              )}
            </SelectTrigger>
            <SelectContent className="flex w-full">
              <SelectGroup>
                {tokens?.map((token) => (
                  <SelectItem
                    className="pl-2"
                    key={token.contractAddress}
                    value={token.contractAddress}
                    label={token.name || token.contractAddress}
                  >
                    <View className="w-full flex-row items-center justify-between">
                      <TokenInfo {...token} />
                      <Text>{token.balance} available</Text>
                    </View>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <View className="flex-row items-center justify-between">
            <Text className="text-md text-primary-foreground">Amount</Text>
          </View>
          <TextInput
            className="w-full rounded-md border border-secondary p-2"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
          />
          <Button
            disabled={isPending}
            className="w-full rounded-md bg-secondary p-2 text-secondary-foreground"
            onPress={send}
          >
            {isPending ? "Confirming..." : "Send"}
          </Button>
          {hash && <Text>Transaction Hash: {hash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}
