import { View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useLoadExploreCasts from "~/hooks/explore/useLoadExploreCasts";

export default function ExploreScreen() {
  const { showCasts, removeCast } = useLoadExploreCasts();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showCasts.map(({ data, platform }, idx) => (
        <View key={data.id}>
          <Text className="text-lg">{data.text}</Text>
          <TouchableOpacity onPress={() => removeCast(data.id)}>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </GestureHandlerRootView>
  );
}
