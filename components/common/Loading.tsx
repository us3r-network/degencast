import { ActivityIndicator, Text, View } from "react-native";
export function Loading() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <ActivityIndicator className="text-secondary"/>
      {/* <Text className=" text-xl text-secondary">Loading...</Text> */}
    </View>
  );
}
