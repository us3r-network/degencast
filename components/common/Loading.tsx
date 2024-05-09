import { Text, View } from "react-native";
export function Loading() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <Text className=" font-interBold text-xl text-secondary">Loading...</Text>
    </View>
  );
}
