import { Animated, Pressable, View } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
import { Text } from "~/components/ui/text";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "~/constants";

export default function DefaultTabBar({
  navigationState,
  position,
  layout,
  jumpTo,
}: SceneRendererProps & {
  navigationState: NavigationState<{ key: string; title: string }>;
}) {
  const routes = navigationState.routes || [];
  const { width } = layout;
  const itemGap = 10;
  const itemPaddingX = 15;
  const itemPaddingY = 6;
  const itemsLen = routes.length;
  const totalGapWidth = itemGap * (itemsLen - 1);
  const itemBoxWidth = (width - totalGapWidth) / itemsLen;
  const itemIndicatorWidth = itemBoxWidth - itemPaddingX * 2;
  const itemIndicatorHeight = 4;
  const itemIndicatorTranslateX = position.interpolate({
    inputRange: routes.map((_, i) => i),
    outputRange: routes.map((_, i) => {
      return i * itemBoxWidth + itemGap * i + itemPaddingX;
    }),
  });
  return (
    <View
      className="relative flex w-full flex-row"
      style={{
        gap: itemGap,
      }}
    >
      {itemBoxWidth > 0 && (
        <>
          <Animated.View
            style={{
              position: "absolute",
              width: itemIndicatorWidth,
              height: itemIndicatorHeight,
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 5,
              transform: [{ translateX: itemIndicatorTranslateX }],
              bottom: 2,
            }}
          />
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
            const translateY = position.interpolate({
              inputRange,
              outputRange: inputRange.map((i) => (i === index ? -4 : 0)),
            });
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                className="flex-1 flex-row items-center justify-center"
                style={{
                  paddingHorizontal: itemPaddingX,
                  paddingVertical: itemPaddingY,
                }}
              >
                <Animated.View
                  style={{
                    transform: [{ translateY }],
                  }}
                >
                  <Text className="text-sm leading-4 text-primary">
                    {label as any}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </>
      )}
    </View>
  );
}

export function OutlineTabBar({
  navigationState,
  position,
  layout,
  jumpTo,
}: SceneRendererProps & {
  navigationState: NavigationState<{ key: string; title: string }>;
}) {
  const routes = navigationState.routes || [];
  const { width } = layout;
  const wrapperPadding = 4;
  const itemGap = 4;
  const itemsLen = routes.length;
  const totalGapWidth = itemGap * (itemsLen - 1);
  const itemBoxWidth = (width - totalGapWidth - wrapperPadding * 2) / itemsLen;
  const itemBoxHeight = 30;
  const itemIndicatorWidth = itemBoxWidth;
  const itemIndicatorHeight = itemBoxHeight;
  const itemIndicatorTranslateX = position.interpolate({
    inputRange: routes.map((_, i) => i),
    outputRange: routes.map((_, i) => {
      return i * itemBoxWidth + itemGap * i;
    }),
  });
  return (
    <View
      className="relative mb-4 w-full flex-row rounded-xl border border-secondary bg-secondary/10"
      style={{
        padding: wrapperPadding,
        gap: itemGap,
      }}
    >
      {itemBoxWidth > 0 && (
        <>
          <Animated.View
            style={{
              position: "absolute",
              width: itemIndicatorWidth,
              height: itemIndicatorHeight,
              backgroundColor: SECONDARY_COLOR,
              borderRadius: 10,
              transform: [{ translateX: itemIndicatorTranslateX }],
              bottom: wrapperPadding,
            }}
          />
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
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                className="flex-row items-center justify-center"
                style={{
                  width: itemBoxWidth,
                  height: itemBoxHeight,
                }}
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
            );
          })}
        </>
      )}
    </View>
  );
}
