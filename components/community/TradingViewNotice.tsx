import { Linking, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";

export default function TradingViewNotice() {
  return (
    <View className=" mt-5 ">
      <Text className=" text-[0.4rem]"> TradingView Lightweight Charts™ </Text>
      <View className=" flex-row">
        <Text className=" text-[0.4rem]">
          {" "}
          Copyright (с) 2023 TradingView, Inc.{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL("https://www.tradingview.com/");
          }}
        >
          <Text className=" inline-block break-all text-[0.4rem] text-[#A36EFE] hover:cursor-pointer hover:underline">
            https://www.tradingview.com/
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
