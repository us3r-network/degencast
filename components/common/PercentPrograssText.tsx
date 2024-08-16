import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
export function PercentPrograssText({
  duration,
  divisor = 100,
}: {
  duration: number;
  divisor: number;
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= divisor) {
          clearInterval(interval);
          return divisor;
        }
        return prev + 1;
      });
    }, duration / divisor);
    return () => clearInterval(interval);
  }, []);
  return (
    <View className="flex-row items-center justify-center gap-4">
      <ActivityIndicator color="white" />
      <Text className="text-white">
        {new Intl.NumberFormat("en-US", {
          style: "percent",
          maximumFractionDigits: 2,
        }).format(progress / divisor)}
      </Text>
    </View>
  );
}
