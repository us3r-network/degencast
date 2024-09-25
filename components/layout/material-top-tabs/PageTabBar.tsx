import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useNavigation } from "expo-router";
import { Animated, Pressable, View } from "react-native";
import { GoBackButtonBgPrimary } from "~/components/common/GoBackButton";
import { Separator } from "~/components/ui/separator";
import {
  Header,
  HeaderCenter,
  HeaderLeft,
  HeaderLogo,
  HeaderRight,
} from "../header/Header";
import { PointLink, SearchLink } from "../header/HeaderLinks";
import { getRouteItemRenderConfig } from "./TabBar";
import { SECONDARY_COLOR } from "~/constants";
import HelpButton from "~/components/help/HelpButton";

export default function PageTabBar(
  props: MaterialTopTabBarProps & {
    level?: number;
    renderRightContent?: () => React.ReactNode;
  },
) {
  const { state, position, level, renderRightContent } = props;
  const { routes } = state;
  const navigation = useNavigation();

  return (
    <Header>
      <HeaderLeft>
        {level ? (
          <GoBackButtonBgPrimary
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : (
          <HeaderLogo />
        )}
      </HeaderLeft>
      <HeaderCenter className="relative flex w-full flex-1 flex-row items-center">
        {routes.map((route, index) => {
          const { options, label, isFocused, onPress, onLongPress } =
            getRouteItemRenderConfig(props, route, index);

          const inputRange = routes.map((_, i) => i);
          const textColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? "white" : SECONDARY_COLOR,
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
        {renderRightContent ? (
          renderRightContent()
        ) : (
          <>
            <HelpButton />
            <PointLink />
            {!level && <SearchLink />}
          </>
        )}
      </HeaderRight>
    </Header>
  );
}
