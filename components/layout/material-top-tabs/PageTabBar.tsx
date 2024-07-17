import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Animated, View, Pressable } from "react-native";
import {
  Header,
  HeaderCenter,
  HeaderLeft,
  HeaderLogo,
  HeaderRight,
} from "../header/Header";
import { Separator } from "~/components/ui/separator";
import { SearchLink } from "../header/HeaderLinks";
import { getRouteItemRenderConfig } from "./TabBar";

export default function PageTabBar(props: MaterialTopTabBarProps) {
  const { state, position, layout } = props;
  const { routes } = state;

  return (
    <Header>
      <HeaderLeft>
        <HeaderLogo />
      </HeaderLeft>
      <HeaderCenter className="relative flex w-full flex-1 flex-row items-center">
        {routes.map((route, index) => {
          const { options, label, isFocused, onPress, onLongPress } =
            getRouteItemRenderConfig(props, route, index);

          const inputRange = routes.map((_, i) => i);
          const textColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? "#fff" : "#A36EFE",
            ),
          });

          return (
            <View className="flex flex-row items-center" key={route.key}>
              {index > 0 && (
                <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <Animated.Text
                  style={{
                    color: textColor,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {label as any}
                </Animated.Text>
              </Pressable>
            </View>
          );
        })}
      </HeaderCenter>
      <HeaderRight>
        <SearchLink />
      </HeaderRight>
    </Header>
  );
}