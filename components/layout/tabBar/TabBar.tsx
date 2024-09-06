import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useNavigation, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { SquarePen } from "~/components/common/Icons";
import { Text } from "~/components/ui/text";
import { DEFAULT_TABBAR_HEIGHT, SECONDARY_COLOR } from "~/constants";
import { cn } from "~/lib/utils";

function MobileTabBar(props: BottomTabBarProps) {
  const { state } = props;
  return (
    <View
      className="relative flex items-center justify-evenly border-t-0 bg-background shadow-md-top"
      style={{
        height: DEFAULT_TABBAR_HEIGHT,
      }}
    >
      <View className="absolute top-[-28px] size-16 rounded-full bg-primary shadow-md-top" />
      <View
        className={cn(
          "h-full w-full max-w-screen-sm flex-row items-end justify-between px-4 py-3 sm:px-0",
        )}
      >
        {state.routes
          .slice(0, state.routes.length / 2)
          .map((route, index: number) => (
            <TabBarItem key={route.key} index={index} props={props} />
          ))}
        <CreateTabBarItem />
        {state.routes
          .slice(state.routes.length / 2, state.routes.length)
          .map((route, index: number) => (
            <TabBarItem
              key={route.key}
              index={index + state.routes.length / 2}
              props={props}
            />
          ))}
      </View>
    </View>
  );
}

export default MobileTabBar;

const TabBarItem = ({
  index,
  props,
}: {
  index: number;
  props: BottomTabBarProps;
}) => {
  const { state, descriptors, navigation } = props;
  const route = state.routes[index];
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
      className={cn(
        "flex h-fit w-fit min-w-[60px] items-center justify-center gap-1",
      )}
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
  );
};

const CreateTabBarItem = () => {
  const router = useRouter();
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
      <View className="flex size-12 items-center justify-center rounded-full bg-white/80">
        <SquarePen stroke={isFocused ? "white" : SECONDARY_COLOR} />
      </View>
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
};
