import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { displayProposalActions } from "../utils";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import { ProposedProposalActionLayout } from "./ProposedProposalAction";
import { ChallengeProposalActionLayout } from "./ChallengeProposalAction";
import { ProposalButton } from "../ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import { ReadyToMintActionLayout } from "./MintAction";
import { CreateProposalButton } from "./CreateProposalAction";

export type ProposalStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
export const ProposalStatusActionsHeight = 32;
export default function ProposalStatusActions({
  cast,
  channel,
  tokenInfo,
  proposal,
}: ProposalStatusActionsProps) {
  const { proposals } = useCacheCastProposal();
  const cachedProposal = proposals?.[cast.hash] || null;
  const updatedProposal = cachedProposal
    ? { ...proposal, ...cachedProposal }
    : proposal;

  const { status, roundIndex } = updatedProposal;

  const display = displayProposalActions({
    channel,
    tokenInfo,
    proposal,
    cast,
  });
  if (!display) return null;
  switch (status) {
    case ProposalState.NotProposed:
      return (
        <CreateProposalButton
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Proposed:
      return (
        <ProposedProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Accepted:
      if (Number(roundIndex) <= 1) {
        return (
          <ProposedProposalActionLayout
            cast={cast}
            channel={channel}
            proposal={updatedProposal}
            tokenInfo={tokenInfo}
          />
        );
      }
      return (
        <ChallengeProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Disputed:
      return (
        <ChallengeProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.ReadyToMint:
      return (
        <ReadyToMintActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Abandoned:
      return (
        <Abandoned
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    default:
      return null;
  }
}

function Abandoned({
  cast,
  channel,
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  return (
    <ProposalButton variant={"abandoned"}>
      <ProposalButtonBody
        cast={cast}
        channel={channel}
        proposal={proposal!}
        tokenInfo={tokenInfo}
        showDeadline={false}
      />
    </ProposalButton>
  );
}
