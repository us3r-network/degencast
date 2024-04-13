import { useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  children: React.ReactNode;
  maxVisibleItems: number;
  index: number;
  animatedValue: SharedValue<number>;
  currentIndex: number;
  backgroundColor: string;
  onNext: () => void;
};

export default function CardSwipe({
  maxVisibleItems,
  index,
  animatedValue,
  currentIndex,
  backgroundColor,
  children,
  onNext,
}: Props) {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const xDirection = useSharedValue(0);
  const yDirection = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY;
      xDirection.value = e.velocityX > 0 ? 1 : -1;
      yDirection.value = e.velocityY > 0 ? 1 : -1;
    })
    .onEnd((e) => {
      if (currentIndex === index) {
        // If the swipe distance is greater than 150 or the swipe velocity is greater than 1000
        // go to the next card
        if (
          Math.abs(e.translationX) > 150 ||
          Math.abs(e.velocityX) > 1000 ||
          Math.abs(e.translationY) > 150 ||
          Math.abs(e.velocityY) > 1000
        ) {
          x.value = withTiming(width * xDirection.value, {}, (bool) => {
            runOnJS(onNext)();
          });
          animatedValue.value = withTiming(currentIndex + 1);
        } else {
          // If the swipe distance is less than 150 or the swipe velocity is less than 1000
          // go back to the original position
          x.value = withTiming(0, { duration: 500 });
          y.value = withTiming(0, { duration: 500 });
          animatedValue.value = withTiming(currentIndex, { duration: 500 });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const currentItem = index === currentIndex;

    const translateY = interpolate(
      animatedValue.value,
      [index - 1, index],
      [-22, 0],
    );
    const scale = interpolate(
      animatedValue.value,
      [index - 1, index],
      [0.95, 1],
    );

    return {
      transform: [
        { translateX: currentItem ? x.value : 0 },
        { translateY: currentItem ? y.value : translateY },
        { scale: currentItem ? 1 : scale },
      ],
      opacity: 1,
    };
  });

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View
        style={[
          {
            backgroundColor,
            borderRadius: 16,
            position: "absolute",
            zIndex: maxVisibleItems - index,
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
