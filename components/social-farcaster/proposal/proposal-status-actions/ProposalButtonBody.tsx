import { CastProposeStatusProps } from "../proposal-modals/ChallengeProposalModal";
import { View, ViewProps } from "react-native";
import { Triangle } from "~/components/common/Icons";
import { Separator } from "~/components/ui/separator";
import { ProposalText } from "../ui/proposal-text";
import { cn } from "~/lib/utils";

export function ProposalButtonBody({
  cast,
  channel,
  proposal,
  tokenInfo,
  showDeadline = true,
  hideDownvote = false,
  className,
  ...props
}: ViewProps &
  CastProposeStatusProps & {
    showDeadline?: boolean;
    hideDownvote?: boolean;
  }) {
  const upvoteCount = isNaN(Number(proposal?.upvoteCount))
    ? 0
    : Number(proposal?.upvoteCount);
  const downvoteCount = isNaN(Number(proposal?.downvoteCount))
    ? 0
    : Number(proposal?.downvoteCount);
  return (
    <View
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    >
      <Triangle size={16} className="  fill-white stroke-white" />
      <ProposalText>{upvoteCount}</ProposalText>
      {!hideDownvote && (
        <>
          <Separator
            orientation="vertical"
            className="mx-1 h-[12px] w-[1.5px] bg-white"
          />
          <View className=" rotate-180 transform">
            <Triangle size={16} className=" fill-white stroke-white" />
          </View>
          <ProposalText>{downvoteCount}</ProposalText>
        </>
      )}
    </View>
  );
}
