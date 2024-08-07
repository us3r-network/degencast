import { View } from "react-native";
import { Progress } from "../ui/progress";
import { Text } from "../ui/text";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { cn } from "~/lib/utils";

export default function LaunchProgress({
  tokenInfo,
  textClassName,
}: {
  tokenInfo?: AttentionTokenEntity;
  textClassName?: string;
}) {
  const progress = Number(tokenInfo?.progress?.replace("%", ""));
  const progressNumber = isNaN(progress) ? 0 : progress;
  return (
    <View className="flex flex-row items-center gap-1">
      {/* <Progress
        value={progressNumber}
        className="h-4 w-[100px] bg-[#D6A5EC]"
        indicatorClassName=" rounded-4 bg-[#9151C3]"
      /> */}
      <Text className={cn("font-bold text-foreground", textClassName)}>
        {progressNumber}%
      </Text>
    </View>
  );
}

export function ChannelDetailLaunchProgress({
  tokenInfo,
  textClassName,
}: {
  tokenInfo?: AttentionTokenEntity;
  textClassName?: string;
}) {
  const progress = Number(tokenInfo?.progress?.replace("%", ""));
  const progressNumber = isNaN(progress) ? 0 : progress;
  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className={cn("text-sm text-primary-foreground", textClassName)}>
          Bounding Curve Progress
        </Text>
        <Text className={cn("text-sm text-primary-foreground", textClassName)}>
          {progressNumber}%
        </Text>
      </View>
      <Progress
        value={progressNumber}
        className="h-4 w-full bg-[#D6A5EC]"
        indicatorClassName=" rounded-4 bg-[#9151C3]"
      />
    </View>
  );
}
