import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Chain, parseEther } from "viem";
import { useSendTransaction } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { DEFAULT_CHAIN } from "~/constants";
import { SHARE_CONTRACT_CHAIN } from "~/hooks/trade/useShareContract";
import { cn } from "~/lib/utils";
import { TokenWithTradeInfo } from "~/services/trade/types";
import { Input } from "../ui/input";
import ActiveWallet from "./ActiveWallet";
import ToeknSelect from "./UserTokenSelect";

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
  const [token, setToken] = useState<TokenWithTradeInfo | undefined>();
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className={cn("p-0")} variant={"link"}>
          <Text>Withdraw</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen border-none">
        <DialogHeader className={cn("flex-row items-center justify-between gap-2")}>
          <DialogTitle>Withdraw</DialogTitle>
          <ActiveWallet />
        </DialogHeader>
        <View className="flex gap-4">
          <View className="flex-row items-center justify-between">
            <Text>Wallet address</Text>
            <Text className="text-sm">Only sending on Base</Text>
          </View>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter wallet address"
            value={address}
            onChangeText={(newText) => setAddress(newText as `0x${string}`)}
          />
          <View className="flex-row items-center justify-between">
            <Text>Token</Text>
          </View>
          <ToeknSelect selectToken={setToken} chain={defaultChain} />
          <View className="flex-row items-center justify-between">
            <Text>Amount</Text>
          </View>
          <Input
            className="border-secondary text-secondary"
            placeholder="Enter amount"
            value={String(amount)}
            onChangeText={(newText) => setAmount(newText)}
          />
          <Button
            variant={"secondary"}
            disabled={isPending}
            className="w-full"
            onPress={send}
          >
            <Text>{isPending ? "Confirming..." : "Withdraw"}</Text>
          </Button>
          {hash && (
            <View className="flex gap-2">
              <Text className="font-bold">Transaction Hash:</Text>
              <Link
                className="text-white/80"
                href={`${SHARE_CONTRACT_CHAIN.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
              >
                {hash}
              </Link>
            </View>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
}
