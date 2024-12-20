import { View } from "react-native";
import DepositButton from "~/components/onchain-actions/wallet/DepositButton";
import FundButton from "~/components/onchain-actions/wallet/FundButton";
import SendTokenButton from "~/components/onchain-actions/wallet/SendTokenButton";
import SwapButton from "~/components/onchain-actions/swap/TradeButton";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import UserWalletSelect from "./UserWalletSelect";

export default function UserWallet() {
  return (
    <Card className="flex gap-6 bg-secondary p-4">
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-primary">
            Active Wallet
          </Text>
        </View>
        <UserWalletSelect disabled={false} />
      </View>
      {/* <Text className="text-3xl font-bold text-white">$1000.00</Text> */}
      <View className="flex-row items-center justify-between">
        <View className="flex items-center gap-1">
          <FundButton variant="icon"/>
          <Text className="text-xs font-medium">Buy</Text>
        </View>
        <View className="flex items-center gap-1">
          <SwapButton />
          <Text className="text-xs font-medium">Swap</Text>
        </View>
        <View className="flex items-center gap-1">
          <DepositButton />
          <Text className="text-xs font-medium">Deposit</Text>
        </View>
        <View className="flex items-center gap-1">
          <SendTokenButton />
          <Text className="text-xs font-medium">Withdraw</Text>
        </View>
      </View>
    </Card>
  );
}
