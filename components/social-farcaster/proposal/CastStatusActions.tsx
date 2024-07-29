import { View } from "react-native";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { Text } from "~/components/ui/text";
import { ActionButton } from "~/components/post/PostActions";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import dayjs from "dayjs";
import CreateProposalButton from "../../social-farcaster/proposal/CreateProposalButton";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import ChallengeProposalButton from "../../social-farcaster/proposal/ChallengeProposalButton";
import UpvoteProposalButton from "../../social-farcaster/proposal/UpvoteProposalButton";
import { BuyButton } from "~/components/trade/ATTButton";
import { displayProposalActions } from "./utils";
import { PropsWithChildren, useMemo } from "react";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";

type CastStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
export const CastStatusActionsHeight = 56;
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
        <NotProposed
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Proposed:
      return (
        <Proposed
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalState.Accepted:
    case ProposalState.Disputed:
      return (
        <ProposalInProgress
          cast={cast}
          channel={channel}
          proposal={updatedProposal}
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

function NotProposed({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">Promising</Text>
      <CreateProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </CastStatusActionsWrapper>
  );
}

function Proposed({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { finalizeTime } = proposal;
  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">
        {dayjs(Number(finalizeTime) * 1000)
          .date(1)
          .format("HH:mm")}{" "}
        Choose your stance
      </Text>
      <UpvoteProposalButton
        proposal={{ ...proposal, status: ProposalState.Disputed }}
        cast={cast}
        channel={channel}
        tokenInfo={tokenInfo}
      />
      <ChallengeProposalButton
        cast={cast}
        channel={channel}
        proposal={{ ...proposal, status: ProposalState.Accepted }}
        tokenInfo={tokenInfo}
      />
    </CastStatusActionsWrapper>
  );
}

function ProposalInProgress({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { status, finalizeTime } = proposal;
  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">
        {status === ProposalState.Disputed ? "👎" : "👍"} finalize in{" "}
        {dayjs(Number(finalizeTime) * 1000)
          .date(1)
          .format("HH:mm")}
      </Text>
      <ChallengeProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </CastStatusActionsWrapper>
  );
}

function ReadyToMint({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { mintedCount } = proposal;

  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">
        {mintedCount ? `${mintedCount} mint` : `First mint`}
      </Text>
      {tokenInfo?.tokenContract && proposal.tokenId && (
        <BuyButton
          tokenAddress={tokenInfo.tokenContract}
          tokenId={Number(proposal.tokenId)}
          renderButton={(props) => {
            return (
              <ActionButton
                className="h-8  w-auto min-w-[60px] rounded-lg px-1"
                {...props}
              >
                <Text>Mint</Text>
              </ActionButton>
            );
          }}
        />
      )}
    </CastStatusActionsWrapper>
  );
}

function Abandoned({ cast, channel, proposal }: CastStatusActionsProps) {
  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">Rebuffed</Text>
    </CastStatusActionsWrapper>
  );
}

function CastStatusActionsWrapper({ children }: PropsWithChildren) {
  return (
    <View
      className="flex w-full flex-row items-center gap-4"
      style={{
        height: CastStatusActionsHeight,
      }}
    >
      {children}
    </View>
  );
}
