import { Animated, Pressable, View } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
import { Text } from "~/components/ui/text";

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
              backgroundColor: "#4C2896",
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
