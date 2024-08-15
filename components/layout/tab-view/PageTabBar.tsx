import { Animated, Pressable, View } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
import { Separator } from "~/components/ui/separator";
import {
  Header,
  HeaderCenter,
  HeaderLeft,
  HeaderLogo,
  HeaderRight,
} from "../header/Header";
import { SearchLink } from "../header/HeaderLinks";
import { SECONDARY_COLOR } from "~/constants";
import HelpButton from "~/components/help/HelpButton";

export default function PageTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string }>;
  },
) {
  const { navigationState, position, layout, jumpTo } = props;
  const routes = navigationState.routes || [];

  return (
    <Header>
      <HeaderLeft>
        <HeaderLogo />
      </HeaderLeft>
      <HeaderCenter className="relative flex w-full flex-1 flex-row items-center">
        {routes.map((route, index) => {
          const label = route.title;
          const isFocused = index === navigationState.index;
          const onPress = () => {
            jumpTo(route.key);
          };
          const onLongPress = () => {
            jumpTo(route.key);
          };
          const inputRange = routes.map((_, i) => i);
          const textColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? "white" : SECONDARY_COLOR,
            ),
          });
          return (
            <View className="flex flex-row items-center" key={index}>
              {index > 0 && (
                <Separator className="mx-4 h-[12px] w-[1px] bg-white" />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
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
        <HelpButton />
        <SearchLink />
      </HeaderRight>
    </Header>
  );
}
