import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { DEFAULT_TABBAR_HEIGHT } from "~/constants";
import { cn } from "~/lib/utils";

function MobileTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;

  return (
    <View
      className="shadow-md-top flex items-center justify-evenly border-t-0 bg-background"
      style={{
        height: DEFAULT_TABBAR_HEIGHT,
      }}
    >
      <View className="h-full w-full max-w-screen-sm flex-row items-center justify-between px-0 py-3 sm:px-8">
        <View className="sm:hidden" />
        {state.routes.map((route, index: number) => {
          // hide nested navigation tabs
          const hasNestedNavigation =
            Platform.OS !== "web" &&
            route.name.includes("/") &&
            !route.name.includes("/index");
          if (hasNestedNavigation) return null;
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
                  color: isFocused ? "#FFF" : "#A36EFE",
                  size: 0,
                })}
              <Text
                className={cn(
                  "text-xs font-medium",
                  isFocused ? "text-white" : "text-secondary",
                )}
              >
                {label as string}
              </Text>
            </Pressable>
          );
        })}
        <View className="sm:hidden" />
      </View>
    </View>
  );
}

export default MobileTabBar;
