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
      <View className="flex-row items-center">
        <Button variant="link" onPress={connectWallet}>
          <Wallet className="font-bold text-secondary" />
        </Button>
        <Text>{shortPubKey(account.address)}</Text>
      </View>
    );
  else
    return (
      <View className="flex-row items-center">
        <Button variant="link" onPress={connectWallet}>
          <Wallet className="font-bold text-secondary" />
        </Button>
        <Text className="font-bold text-secondary">No Active Wallet</Text>{" "}
      </View>
    );
}
