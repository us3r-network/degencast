import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Animated, View, Pressable, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "~/constants";

export const getRouteItemRenderConfig = (
  tabBarProps: MaterialTopTabBarProps,
  route: MaterialTopTabBarProps["state"]["routes"][0],
  index: number,
) => {
  const { state, descriptors, navigation } = tabBarProps;
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
  return {
    options,
    label,
    isFocused,
    onPress,
    onLongPress,
  };
};
export default function DefaultTabBar(props: MaterialTopTabBarProps) {
  const { state, position, layout } = props;
  const { routes } = state;
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
            const { options, label, isFocused, onPress, onLongPress } =
              getRouteItemRenderConfig(props, route, index);

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
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
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

export function OutlineTabBar(props: MaterialTopTabBarProps) {
  const { state, position, layout } = props;
  const { routes } = state;
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
      className="relative box-border flex w-full flex-row rounded-xl border border-secondary bg-muted"
      style={{
        padding: wrapperPadding,
        gap: itemGap,
        backgroundColor: "rgba(163, 110, 254, 0.10)",
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
              borderRadius: 10,
              transform: [{ translateX: itemIndicatorTranslateX }],
              bottom: wrapperPadding,
            }}
          />
          {routes.map((route, index) => {
            const { options, label, isFocused, onPress, onLongPress } =
              getRouteItemRenderConfig(props, route, index);

            const inputRange = routes.map((_, i) => i);
            // const translateY = position.interpolate({
            //   inputRange,
            //   outputRange: inputRange.map((i) => (i === index ? -4 : 0)),
            // });

            const textColor = position.interpolate({
              inputRange,
              outputRange: inputRange.map((i) =>
                i === index ? "white" : PRIMARY_COLOR,
              ),
            });

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                className="flex-row items-center justify-center"
                style={{
                  width: itemBoxWidth,
                  height: itemBoxHeight,
                }}
              >
                <Animated.View>
                  <Animated.Text
                    style={{
                      color: textColor,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {label as any}
                  </Animated.Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </>
      )}
    </View>
  );
}

export function ScrollTabBar(props: MaterialTopTabBarProps) {
  const { state, position, layout } = props;
  const { routes } = state;
  const itemGap = 10;

  return (
    <View className="w-full">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={routes}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          return;
        }}
        ItemSeparatorComponent={() => <View style={{ width: itemGap }} />}
        renderItem={({ item: route, index }) => {
          const { options, label, isFocused, onPress, onLongPress } =
            getRouteItemRenderConfig(props, route, index);

          const inputRange = routes.map((_, i) => i);

          const textColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? "white" : SECONDARY_COLOR,
            ),
          });
          const bgColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? SECONDARY_COLOR : "rgba(145, 81, 195, 0.20)",
            ),
          });
          const borderColor = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) =>
              i === index ? "transparent" : SECONDARY_COLOR,
            ),
          });
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <Animated.View
                style={{
                  padding: 8,
                  backgroundColor: bgColor,
                  borderWidth: 1,
                  borderColor: borderColor,
                  borderRadius: 8,
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
              </Animated.View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
