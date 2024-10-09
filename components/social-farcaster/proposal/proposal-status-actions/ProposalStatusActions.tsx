import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { displayProposalActions } from "../utils";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import { ProposedProposalActionLayout } from "./ProposedProposalAction";
import { ChallengeProposalActionLayout } from "./ChallengeProposalAction";
import { ReadyToMintActionLayout } from "./MintAction";
import { CreateProposalActionLayout } from "./CreateProposalAction";
import useCacheCastAttToken from "~/hooks/social-farcaster/proposal/useCacheCastAttToken";
import { AbandonedProposalActionLayout } from "./AbandonedProposalAction";

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

  const { getCachedAttToken } = useCacheCastAttToken();
  const cachedTokenInfo = getCachedAttToken(channel?.channelId!);
  const updatedTokenInfo = cachedTokenInfo
    ? { ...tokenInfo, ...cachedTokenInfo }
    : tokenInfo;

  const display = displayProposalActions({
    channel,
    tokenInfo,
    proposal,
    cast,
  });
  // if (!display) return null;
  if (!channel?.channelId) return null;
  switch (status) {
    case ProposalState.NotProposed:
      return (
        <CreateProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    case ProposalState.Proposed:
      return (
        <ProposedProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    case ProposalState.Accepted:
      if (Number(roundIndex) <= 1) {
        return (
          <ProposedProposalActionLayout
            cast={cast}
            channel={channel}
            proposal={updatedProposal}
            tokenInfo={updatedTokenInfo}
          />
        );
      }
      return (
        <ChallengeProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    case ProposalState.Disputed:
      return (
        <ChallengeProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    case ProposalState.ReadyToMint:
      return (
        <ReadyToMintActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    case ProposalState.Abandoned:
      return (
        <AbandonedProposalActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    default:
      return null;
  }
}
