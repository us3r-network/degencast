import { useConnectWallet } from "@privy-io/react-auth";
import { Wallet } from "lucide-react-native";
import { View } from "react-native";
import { useAccount } from "wagmi";
import { shortPubKey } from "~/utils/shortPubKey";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function ActiveWallet() {
  const account = useAccount();
  const { connectWallet } = useConnectWallet();
  if (account.address)
    return (
      <View className="flex-row items-center justify-between">
        <Text>{shortPubKey(account.address)}</Text>
        <Button className="flex-row items-center gap-2 p-0" onPress={connectWallet}>
          <Wallet className="font-bold text-secondary" />
          <Text className="font-bold text-secondary">Switch</Text>
        </Button>
      </View>
    );
  else
    return (
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-secondary">No Active Wallet</Text>{" "}
        <Button className="flex-row items-center gap-2 p-0" onPress={connectWallet}>
          <Wallet className="font-bold text-secondary" />
          <Text className="font-bold text-secondary">Connect</Text>
        </Button>
      </View>
    );
}
