import { useRef, useState } from "react";
import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";

export default function StaticProgressBar({
  progress,
  className,
}: ViewProps & {
  progress: number; // decimal value
}) {
  const gridWidth = 18;
  const [viewWidth, setViewWidth] = useState(0);
  const gridsNumber = Math.floor(viewWidth / gridWidth);
  const progressGridsNumber = Math.floor(gridsNumber * progress);
  return (
    <View
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
      className={cn(
        "h-5 w-full flex-row items-start justify-start gap-px rounded-bl rounded-tr border border-slate-100",
        className,
      )}
    >
      <View className="flex-row items-start justify-start gap-px bg-gradient-to-r from-violet-900 to-pink-100">
        {Array.from({ length: progressGridsNumber }, (_, i) => {
          const isLast = i === progressGridsNumber - 1;
          return (
            <View
              key={i}
              className={cn(
                `h-5 w-[${gridWidth}px]`,
                !isLast && "border-r border-slate-50",
              )}
            />
          );
        })}
      </View>
    </View>
  );
}
