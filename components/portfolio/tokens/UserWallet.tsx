import { View } from "react-native";
import FundButton from "~/components/trade/FundButton";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import SendTokenButton, { SEND_TOKEN_TYPE } from "../../trade/SendTokenButton";
import SwapButton from "../../trade/TradeButton";
import UserWalletSelect from "../user/UserWalletSelect";

export default function UserWallet() {
  return (
    <Card className="flex gap-4 bg-secondary p-4">
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="font-medium">Balance</Text>
        </View>
        <UserWalletSelect />
      </View>
      <Text className="text-3xl font-bold text-white">$1000.00</Text>
      <View className="flex-row items-center justify-evenly">
        <View className="flex items-center gap-1">
          <FundButton />
          <Text className="text-xs font-medium">Buy</Text>
        </View>
        <View className="flex items-center gap-1">
          <SwapButton />
          <Text className="text-xs font-medium">Swap</Text>
        </View>
        <View className="flex items-center gap-1">
          <SendTokenButton type={SEND_TOKEN_TYPE.DEPOSIT} />
          <Text className="text-xs font-medium">Deposit</Text>
        </View>
        <View className="flex items-center gap-1">
          <SendTokenButton type={SEND_TOKEN_TYPE.WITHDRAW} />
          <Text className="text-xs font-medium">Withdraw</Text>
        </View>
      </View>
    </Card>
  );
}
