import { Pressable, View } from "react-native";
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view";
import { Text } from "~/components/ui/text";

export default function DefaultTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string }>;
  },
) {
  return (
    <TabBar
      style={{
        width: "100%",
        backgroundColor: "transparent",
      }}
      contentContainerStyle={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 0,
      }}
      indicatorStyle={{
        backgroundColor: "#4C2896",
      }}
      renderTabBarItem={(p) => {
        const route = p.route;
        return (
          <Pressable
            onPress={() => {
              props.jumpTo(route.key);
            }}
          >
            <View className="flex-1 flex-row items-center justify-center p-4">
              <Text className={`text-sm text-primary`}>{route.title}</Text>
            </View>
          </Pressable>
        );
      }}
      {...props}
    />
  );
}
