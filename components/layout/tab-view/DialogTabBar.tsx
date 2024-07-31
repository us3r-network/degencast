import { Animated, Pressable, View } from "react-native";
import { NavigationState, SceneRendererProps } from "react-native-tab-view";
import { Separator } from "~/components/ui/separator";
import { DialogHeader } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

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
              i === index ? "#fff" : "#A36EFE",
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
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  {label as any}
                </Animated.Text>
              </Pressable>
            </View>
          );
        })}
      </DialogHeader>
    </View>
  );
}
