import { Pressable, View } from "react-native";
import { Image } from "react-native";
import { formatUnits } from "viem";
import { Text } from "~/components/ui/text";
import { NATIVE_TOKEN_ADDRESS } from "~/constants/chain";
import { TokenWithTradeInfo } from "~/services/trade/types";

const formatAmount = (token: TokenWithTradeInfo, amount: bigint) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: token.address === NATIVE_TOKEN_ADDRESS ? 6 : 2,
  }).format(Number(formatUnits(amount, token.decimals!)));
};
export default function PriceRow({
  title,
  paymentTokenInfo,
  price,
  isLoading,
  onClickPriceValue,
}: {
  title?: string;
  paymentTokenInfo?: TokenWithTradeInfo;
  price?: bigint;
  isLoading?: boolean;
  onClickPriceValue?: () => void;
}) {
  return (
    <View className="flex flex-row items-center justify-between">
      <Text>{title || "Total Cost"}</Text>
      <View className="flex flex-row items-center gap-1">
        <Image
          source={require("~/assets/images/degen-icon-2.png")}
          resizeMode="contain"
          style={{ width: 20, height: 20 }}
        />
        <Pressable onPress={onClickPriceValue}>
          <Text className="font-normal">
            {isLoading || !price || !paymentTokenInfo?.decimals
              ? "--"
              : formatAmount(paymentTokenInfo, price)}{" "}
            {paymentTokenInfo?.symbol}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
