import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import CreateProposalButton from "../../social-farcaster/proposal/CreateProposalButton";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import ChallengeProposalButton from "../../social-farcaster/proposal/ChallengeProposalButton";
import { BuyButton } from "~/components/trade/ATTButton";
import { displayProposalActions } from "./utils";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import ProposedProposalButton from "./ProposedProposalButton";
import { ProposalButton } from "./ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import { ReadyToMint } from "./MintButton";

export type CastStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
export const CastStatusActionsHeight = 32;
export default function CastStatusActions({
  cast,
  channel,
  tokenInfo,
  proposal,
}: CastStatusActionsProps) {
  const { proposals } = useCacheCastProposal();
  const cachedProposal = proposals?.[cast.hash] || null;
  const updatedProposal = cachedProposal
    ? { ...proposal, ...cachedProposal }
    : proposal;

  const { status } = updatedProposal;

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
        <ProposedProposalButton
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Accepted:
    case ProposalState.Disputed:
      return (
        <ChallengeProposalButton
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.ReadyToMint:
      return (
        <ReadyToMint
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
}: CastStatusActionsProps) {
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
