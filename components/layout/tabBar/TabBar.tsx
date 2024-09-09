import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SquarePen } from "~/components/common/Icons";
import { CreateChannelDialog } from "~/components/rank/CreateChannelButton";
import { Button } from "~/components/ui/button";
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

const ActionMenuCtx = React.createContext<{
  showMenu?: boolean;
  scaleAnimatedValue: Animated.Value;
  translateYAnimatedValue: Animated.Value;
  translateXAnimatedValue: Animated.Value;
}>({
  showMenu: false,
  scaleAnimatedValue: new Animated.Value(0),
  translateYAnimatedValue: new Animated.Value(0),
  translateXAnimatedValue: new Animated.Value(0),
});
function useActionMenuCtx() {
  const context = useContext(ActionMenuCtx);
  if (!context) {
    throw new Error("useActionMenuCtx must be used within ActionMenuCtx");
  }
  return context;
}

const CreateTabBarItem = () => {
  const router = useRouter();
  const isFocused = false;
  const [showActions, setShowActions] = useState(false);
  const toggleBtnAnimation = useState(new Animated.Value(0))[0];
  const toggleActions = useCallback(() => {
    setShowActions((prev) => !prev);
  }, [showActions, setShowActions]);
  useEffect(() => {
    Animated.timing(toggleBtnAnimation, {
      toValue: showActions ? 1 : 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showActions]);
  const scaleAnimatedValue = useState(new Animated.Value(0))[0];
  const translateYAnimatedValue = useState(new Animated.Value(0))[0];
  const translateXAnimatedValue = useState(new Animated.Value(0))[0];

  const [showDialog, setShowDialog] = useState(false);
  return (
    <View className="flex h-16 w-16 items-center justify-center z-50">
      {showActions && (
        <TouchableWithoutFeedback
          onPress={() => setShowActions(false)}
        ><View className="absolute w-screen h-screen bottom-0"/></TouchableWithoutFeedback>
      )}
      <ActionMenuCtx.Provider
        value={{
          showMenu: showActions,
          scaleAnimatedValue,
          translateYAnimatedValue,
          translateXAnimatedValue,
        }}
      >
        <ActionMenuItem index={1}>
          <Button
            variant="secondary"
            size="sm"
            className="w-16"
            onPress={() => {
              setShowActions(false);
              router.push("/create");
            }}
          >
            <Text>Cast</Text>
          </Button>
        </ActionMenuItem>
        <ActionMenuItem index={2}>
          <Button
            variant="secondary"
            size="sm"
            className="w-16"
            onPress={() => {
              setShowDialog(true);
              setShowActions(false);
            }}
          >
            <Text>Channel</Text>
          </Button>
        </ActionMenuItem>
      </ActionMenuCtx.Provider>
      <Pressable
        key={"create"}
        className="absolute bottom-0 flex h-fit w-fit min-w-[60px] items-center justify-center gap-1"
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={() => {
          toggleActions();
        }}
      >
        <View
          className={cn(
            "flex size-12 items-center justify-center rounded-full bg-white/80",
            showActions ? "bg-secondary" : "bg-white/80",
          )}
        >
          <SquarePen stroke={showActions ? "white" : SECONDARY_COLOR} />
        </View>
        <Text
          className={cn(
            "text-xs font-medium",
            showActions ? "text-white" : "text-secondary",
          )}
        >
          Create
        </Text>
      </Pressable>
      <CreateChannelDialog open={showDialog} setOpen={setShowDialog} />
    </View>
  );
};

function ActionMenuItem({
  index,
  children,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const {
    showMenu,
    scaleAnimatedValue,
    translateXAnimatedValue,
    translateYAnimatedValue,
  } = useActionMenuCtx();

  useEffect(() => {
    Animated.timing(scaleAnimatedValue, {
      toValue: showMenu ? 1 : 0,
      duration: 200 * index,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateXAnimatedValue, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateYAnimatedValue, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMenu]);

  const translateStyleX = useMemo(() => {
    switch (index) {
      case 1:
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80],
          }),
        };
      case 2:
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 80],
          }),
        };
      default:
        return {
          translateX: translateYAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0],
          }),
        };
    }
  }, [translateYAnimatedValue]);
  const actionStyle = {
    width: 64,
    height: 32,
    position: "absolute" as "absolute",
    zIndex: index,

    opacity: scaleAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: scaleAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      translateStyleX,
      {
        translateY: translateYAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, -60],
        }),
      },
    ],
  };
  return <Animated.View style={[actionStyle]}>{children}</Animated.View>;
}
