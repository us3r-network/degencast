import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useNavigation, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { SquarePen } from "~/components/common/Icons";
import { Text } from "~/components/ui/text";
import { DEFAULT_TABBAR_HEIGHT, SECONDARY_COLOR } from "~/constants";
import { cn } from "~/lib/utils";

function MobileTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  return (
    <View
      className="flex items-center justify-evenly border-t-0 bg-background shadow-md-top"
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

          const customRoute = insertCustomRouteAfterIndex(index);
          return (
            <>
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
                    color: isFocused ? "white" : SECONDARY_COLOR,
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
              {customRoute}
            </>
          );
        })}
        <View className="sm:hidden" />
      </View>
    </View>
  );
}

export default MobileTabBar;

const insertCustomRouteAfterIndex = (index: number) => {
  const router = useRouter();
  if (index === 1) {
    const isFocused = false;
    return (
      <Pressable
        key={"create"}
        className=" flex h-fit w-fit min-w-[60px] items-center justify-center gap-1"
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={() => {
          router.push("/create");
        }}
        onLongPress={() => {
          router.push("/create");
        }}
      >
        <SquarePen stroke={isFocused ? "white" : SECONDARY_COLOR} />
        <Text
          className={cn(
            "text-xs font-medium",
            isFocused ? "text-white" : "text-secondary",
          )}
        >
          Cast
        </Text>
      </Pressable>
    );
  }
  return null;
};
