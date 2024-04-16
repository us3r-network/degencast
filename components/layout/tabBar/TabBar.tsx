import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

function MobileTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const { colors } = useTheme();

  return (
    <View className="flex items-center justify-evenly bg-background p-4">
      <Card className="w-full max-w-screen-sm flex-row items-center justify-evenly rounded-full p-2">
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
            <TouchableOpacity
              className="flex h-12 items-center justify-center gap-2"
              accessibilityRole={Platform.OS === "web" ? "link" : "button"}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? "#A36EFE" : colors.primary, //todo: use theme NOT colors
                  size: 0,
                })}
              <Text
                className={cn(
                  "text-xs font-bold",
                  isFocused ? "text-secondary" : "text-primary",
                )}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>
    </View>
  );
}

export default MobileTabBar;
