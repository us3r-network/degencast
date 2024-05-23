import { View } from "react-native";
import DepositButton from "~/components/trade/DepositButton";
import FundButton from "~/components/trade/FundButton";
import SendTokenButton from "~/components/trade/SendTokenButton";
import SwapButton from "~/components/trade/TradeButton";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import UserWalletSelect from "./UserWalletSelect";

export default function UserWallet() {
  return (
    <Card className="flex gap-6 bg-secondary p-4">
      <View className="w-full flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-2">
          <Text className="font-medium">Active Wallet</Text>
        </View>
        <UserWalletSelect />
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
