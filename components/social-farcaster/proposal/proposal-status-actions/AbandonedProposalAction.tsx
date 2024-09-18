import { CastProposeStatusProps } from "../proposal-modals/ChallengeProposalModal";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import AbandonedProposalModal from "../proposal-modals/AbandonedProposalModal";
import { View } from "react-native";
import { Deadline } from "../ProposalStyled";

export function AbandonedProposalAction({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ProposalButtonProps & CastProposeStatusProps) {
  if (!proposal) return null;
  const buttonBody = (
    <ProposalButtonBody
      cast={cast}
      channel={channel}
      proposal={proposal!}
      tokenInfo={tokenInfo}
    />
  );

  return (
    <AbandonedProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ProposalButton variant={"abandoned"} {...props}>
          {buttonBody}
        </ProposalButton>
      }
    />
  );
}

export function AbandonedProposalActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastProposeStatusProps) {
  return (
    <View className="flex flex-row items-center gap-4">
      {proposal?.finalizeTime && (
        <Deadline timestamp={proposal?.finalizeTime} />
      )}

      <AbandonedProposalAction
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
