import { Animated, Pressable, View } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
import { Separator } from "~/components/ui/separator";
import { DialogHeader } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { SECONDARY_COLOR } from "~/constants";

export default function DialogTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string }>;
  },
) {
  const { navigationState, position, layout, jumpTo } = props;
  const routes = navigationState.routes || [];

  return (
    <View className="mb-4 w-full">
      <DialogHeader className={cn("flex flex-row items-center gap-2")}>
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
            <>
              {index > 0 && (
                <Separator
                  key={"separator-" + index}
                  className="mx-4 my-0 h-[12px] w-[1px] bg-white"
                />
              )}
              <Pressable
                key={"tabbar-" + index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <Animated.Text
                  style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: isFocused ? 700 : 500,
                    lineHeight: 24,
                  }}
                >
                  {label as any}
                </Animated.Text>
              </Pressable>
            </>
          );
        })}
      </DialogHeader>
    </View>
  );
}
