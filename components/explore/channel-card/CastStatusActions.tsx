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
import CreateProposalButton from "../proposal/CreateProposalButton";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import ChallengeProposalButton from "../proposal/ChallengeProposalButton";
import UpvoteProposalButton from "../proposal/UpvoteProposalButton";

type CastStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
};
export default function CastStatusActions({
  cast,
  channel,
  tokenInfo,
  proposal,
}: CastStatusActionsProps) {
  const { status } = proposal;
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
      return <Accepted cast={cast} channel={channel} proposal={proposal} />;
    case ProposalStatus.ReadyToMint:
      return <Accepted cast={cast} channel={channel} proposal={proposal} />;
    case ProposalStatus.Rejected:
      return <Rejected cast={cast} channel={channel} proposal={proposal} />;
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
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">Promising</Text>
      <CreateProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}

function Proposed({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { result, finalizeTime, upvoteCount, downvoteCount } = proposal;
  return (
    <View className="flex w-full flex-row items-center gap-4">
      {!downvoteCount ? (
        <Text className="mr-auto text-sm text-secondary">
          24:00 Choose your stance
        </Text>
      ) : (
        <Text className="mr-auto text-sm text-secondary">
          {result === ProposalResult.Downvote ? "👎" : "👍"} finalize in{" "}
          {dayjs(finalizeTime).date(1).format("HH:mm")}
        </Text>
      )}
      {Number(upvoteCount) < 2 ? (
        <UpvoteProposalButton
          proposal={{ ...proposal, result: ProposalResult.Downvote }}
          cast={cast}
          channel={channel}
          tokenInfo={tokenInfo}
        />
      ) : !downvoteCount ? (
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
      ) : (
        <ChallengeProposalButton
          cast={cast}
          channel={channel}
          proposal={proposal}
          tokenInfo={tokenInfo}
        />
      )}
    </View>
  );
}
function Accepted({ cast, channel, proposal }: CastStatusActionsProps) {
  const { mintedCount } = proposal;
  return (
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">
        {mintedCount ? `${mintedCount} mint` : `First mint`}
      </Text>
      <ActionButton
        onPress={() => {
          alert("TODO");
        }}
      >
        <Text className="text-sm">Mint</Text>
      </ActionButton>
    </View>
  );
}

function Rejected({ cast, channel, proposal }: CastStatusActionsProps) {
  return (
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">Rebuffed</Text>
    </View>
  );
}
