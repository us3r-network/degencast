import { View } from "react-native";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { CommunityEntity } from "~/services/community/types/community";
import { Text } from "~/components/ui/text";
import { ActionButton } from "~/components/post/PostActions";
import {
  ProposalEntity,
  ProposalResult,
  ProposalStatus,
} from "~/services/feeds/types/proposal";
import dayjs from "dayjs";
import CreateProposalButton from "../../social-farcaster/proposal/CreateProposalButton";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import ChallengeProposalButton from "../../social-farcaster/proposal/ChallengeProposalButton";
import UpvoteProposalButton from "../../social-farcaster/proposal/UpvoteProposalButton";
import { BuyButton } from "~/components/trade/ATTButton";
import { displayProposalActions } from "./utils";
import { PropsWithChildren } from "react";

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
  const { status } = proposal;
  const display = displayProposalActions({
    channel,
    tokenInfo,
    proposal,
  });
  if (!display) return null;
  switch (status) {
    case ProposalStatus.None:
      return (
        <NotProposed
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalStatus.Proposed:
      return (
        <Proposed
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalStatus.Accepted:
      return (
        <Accepted
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalStatus.ReadyToMint:
      return (
        <ReadyToMint
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      );
    case ProposalStatus.Rejected:
      return (
        <Rejected
          cast={cast}
          channel={channel}
          proposal={proposal}
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
  const { result, finalizeTime, upvoteCount, downvoteCount, roundIndex } =
    proposal;
  const roundIndexNumber = isNaN(Number(roundIndex)) ? 0 : Number(roundIndex);
  return (
    <CastStatusActionsWrapper>
      {roundIndexNumber < 2 ? (
        <Text className="mr-auto text-sm text-secondary">
          {dayjs(Number(finalizeTime) * 1000)
            .date(1)
            .format("HH:mm")}{" "}
          Choose your stance
        </Text>
      ) : (
        <Text className="mr-auto text-sm text-secondary">
          {result === ProposalResult.Downvote ? "👎" : "👍"} finalize in{" "}
          {dayjs(Number(finalizeTime) * 1000)
            .date(1)
            .format("HH:mm")}
        </Text>
      )}
      {roundIndexNumber < 1 ? (
        <UpvoteProposalButton
          proposal={{ ...proposal, result: ProposalResult.Downvote }}
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
        />
      ) : roundIndexNumber === 1 ? (
        <>
          <UpvoteProposalButton
            proposal={{ ...proposal, result: ProposalResult.Downvote }}
            cast={cast}
            channel={channel}
            tokenInfo={tokenInfo}
          />
          <ChallengeProposalButton
            cast={cast}
            channel={channel}
            proposal={{ ...proposal, result: ProposalResult.Upvote }}
            tokenInfo={tokenInfo}
          />
        </>
      ) : roundIndexNumber > 1 ? (
        <ChallengeProposalButton
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      ) : null}
    </CastStatusActionsWrapper>
  );
}
function Accepted({ cast, channel, proposal }: CastStatusActionsProps) {
  const { result, finalizeTime } = proposal;
  return (
    <CastStatusActionsWrapper>
      <Text className="mr-auto text-sm text-secondary">
        {result === ProposalResult.Downvote ? "👎" : "👍"} finalize in{" "}
        {dayjs(Number(finalizeTime) * 1000)
          .date(1)
          .format("HH:mm")}
      </Text>
      <Text className="text-sm text-secondary">Accepted</Text>
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
  console.log("mintedCount", mintedCount);
  console.log("tokenInfo?.tokenContract", tokenInfo?.tokenContract);
  console.log("proposal.tokenId", proposal.tokenId);
  console.log("tokenInfo", tokenInfo);

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

function Rejected({ cast, channel, proposal }: CastStatusActionsProps) {
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
