import { Pressable, View } from "react-native";
import { Image } from "react-native";
import { formatUnits } from "viem";
import { Text } from "~/components/ui/text";
import { TokenWithTradeInfo } from "~/services/trade/types";

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
      <Text>{title || "Total Coast"}</Text>
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
              : Number(formatUnits(price, paymentTokenInfo.decimals)).toFixed(
                  2,
                )}{" "}
            {paymentTokenInfo?.symbol}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
