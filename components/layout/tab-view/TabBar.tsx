import { useState } from "react";
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
  const [width, setWidth] = useState(0);
  return (
    <View
      className="w-full py-2"
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      {!!width && (
        <TabBar
          style={{
            backgroundColor: "transparent",
            shadowOffset: { height: 0, width: 0 },
            shadowColor: "transparent",
            shadowOpacity: 0,
            elevation: 0,
          }}
          indicatorStyle={{
            backgroundColor: "#4C2896",
            height: 4,
            borderRadius: 5,
          }}
          renderTabBarItem={(p) => {
            const route = p.route;
            return (
              <Pressable
                style={{
                  width: width / props.navigationState.routes.length,
                }}
                onPress={() => {
                  props.jumpTo(route.key);
                }}
              >
                <View className="w-full flex-row items-center justify-center pb-2">
                  <Text className={`text-sm leading-4 text-primary`}>
                    {route.title}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          {...props}
        />
      )}
    </View>
  );
}
