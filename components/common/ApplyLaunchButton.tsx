import { Text } from "~/components/ui/text";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "~/lib/utils";
import { openWarpcastCreateCast } from "~/utils/platform-sharing/warpcast";

export default function ApplyLaunchButton({
  className,
  ...props
}: ButtonProps & { channelId: string }) {
  return (
    <Button
      className={cn("bg-secondary", className)}
      onPress={() => {
        openWarpcastCreateCast(
          `Hey @liang, I want to /degencast for /${props.channelId}!`,
        );
      }}
    >
      <Text>Apply</Text>
    </Button>
  );
}

export function ExploreApplyLaunchButton({
  className,
  ...props
}: ButtonProps & { channelId: string }) {
  return (
    <Button
      className={cn(
        "h-[60px] flex-row items-center gap-1 rounded-[20px] bg-secondary px-[12px] py-[6px]",
        className,
      )}
      onPress={() => {
        openWarpcastCreateCast(
          `Hey @liang, I want to /degencast for /${props.channelId}!`,
        );
      }}
    >
      <Text className=" text-2xl font-bold">Apply to Launch Token</Text>
    </Button>
  );
}
