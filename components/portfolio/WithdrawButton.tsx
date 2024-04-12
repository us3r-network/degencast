import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Chain, parseEther } from "viem";
import { useSendTransaction } from "wagmi";
import { TokenInfoWithMetadata } from "~/services/user/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "../ui/dialog";
import ToeknSelect from "./UserTokenSelect";
import { DEFAULT_CHAIN } from "~/constants";

export default function WithdrawButton({
  defaultAddress,
  defaultChain = DEFAULT_CHAIN,
}: {
  defaultAddress: `0x${string}`;
  defaultChain?: Chain;
}) {
  // console.log("SendButton tokens", availableTokens);
  const [address, setAddress] = useState(defaultAddress);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<TokenInfoWithMetadata | undefined>();
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const send = async () => {
    // console.log("Send", { address, amount, token });
    sendTransaction({ to: address, value: parseEther(amount) });
  };

  useEffect(() => {
    if (token) {
      setAmount(String(token?.balance) || "0");
    }
  }, [token]);
  return (
    <Dialog className="text-white">
      <DialogTrigger asChild>
        <Pressable>
          <Text className="font-bold text-secondary">Withdraw</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent  className="box-border w-screen text-primary-foreground">
        <DialogTitle className="text-md font-bold">Withdraw</DialogTitle>
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
          <ToeknSelect selectToken={setToken} chain={defaultChain} />
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
            {isPending ? "Confirming..." : "Withdraw"}
          </Button>
          {hash && <Text>Transaction Hash: {hash}</Text>}
        </View>
      </DialogContent>
    </Dialog>
  );
}
