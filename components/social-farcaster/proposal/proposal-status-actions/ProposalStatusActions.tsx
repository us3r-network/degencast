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
import { ProposalButton } from "../ui/proposal-button";
import { ProposalText } from "../ui/proposal-text";
import { ProposalLikeButton } from "./ProposalLikeButton";
import { View } from "react-native";

export type ProposalStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
export const ProposalStatusActionsHeight = 32;
function ProposalStatusActions({
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

  // const display = displayProposalActions({
  //   channel,
  //   tokenInfo,
  //   proposal,
  //   cast,
  // });
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
        <ProposalLikeButton
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    // case ProposalState.Proposed:
    //   return (
    //     <ProposedProposalActionLayout
    //       cast={cast}
    //       channel={channel}
    //       proposal={updatedProposal}
    //       tokenInfo={updatedTokenInfo}
    //     />
    //   );
    // case ProposalState.Accepted:
    //   if (Number(roundIndex) <= 1) {
    //     return (
    //       <ProposedProposalActionLayout
    //         cast={cast}
    //         channel={channel}
    //         proposal={updatedProposal}
    //         tokenInfo={updatedTokenInfo}
    //       />
    //     );
    //   }
    //   return (
    //     <ChallengeProposalActionLayout
    //       cast={cast}
    //       channel={channel}
    //       proposal={updatedProposal}
    //       tokenInfo={updatedTokenInfo}
    //     />
    //   );
    // case ProposalState.Disputed:
    //   return (
    //     <ChallengeProposalActionLayout
    //       cast={cast}
    //       channel={channel}
    //       proposal={updatedProposal}
    //       tokenInfo={updatedTokenInfo}
    //     />
    //   );
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
        <ReadyToMintActionLayout
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={updatedTokenInfo}
        />
      );
    // return (
    //   <AbandonedProposalActionLayout
    //     cast={cast}
    //     channel={channel}
    //     proposal={updatedProposal}
    //     tokenInfo={updatedTokenInfo}
    //   />
    // );
    default:
      return (
        <ProposalButton variant={"proposed-free"} disabled={true}>
          <ProposalText>Like for $CAST</ProposalText>
        </ProposalButton>
      );
  }
}

export default function ProposalStatusActionsLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  return (
    <View className="w-[80%] max-w-[278px]">
      <ProposalStatusActions
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
