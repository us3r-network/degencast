import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, Pressable, TouchableOpacity, View } from "react-native";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

function MobileTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;

  return (
    <View className="flex items-center justify-evenly border-t-0 bg-background p-4">
      <Card className="h-[60px] w-full max-w-screen-sm flex-row items-center justify-between rounded-[20px] px-10 py-3">
        {state.routes.map((route, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              className=" flex h-fit w-fit min-w-[60px] items-center justify-center gap-1"
              accessibilityRole={Platform.OS === "web" ? "link" : "button"}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? "#A36EFE" : "#4C2896",
                  size: 0,
                })}
              <Text
                className={cn(
                  "text-xs font-medium",
                  isFocused ? "text-secondary" : "text-primary",
                )}
              >
                {label as string}
              </Text>
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}

export default MobileTabBar;
