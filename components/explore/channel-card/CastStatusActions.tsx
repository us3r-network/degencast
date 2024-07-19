import { View } from "react-native";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { getCastHex } from "~/utils/farcaster/cast-utils";
import { CommunityEntity } from "~/services/community/types/community";
import { FCastExploreActions } from "~/components/social-farcaster/FCastActions";
import { Text } from "~/components/ui/text";
import { ActionButton } from "~/components/post/PostActions";
import {
  ProposalEntity,
  ProposalResult,
  ProposalStatus,
} from "~/services/feeds/types/proposal";
import dayjs from "dayjs";

type CastStatusActionsProps = {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
};
export default function CastStatusActions({
  cast,
  channel,
  proposal,
}: CastStatusActionsProps) {
  const { status } = proposal;
  switch (status) {
    case ProposalStatus.None:
      return <NotProposed cast={cast} channel={channel} proposal={proposal} />;
    case ProposalStatus.Proposed:
      return <Proposed cast={cast} channel={channel} proposal={proposal} />;
    case ProposalStatus.Accepted:
      return <Accepted cast={cast} channel={channel} proposal={proposal} />;
    case ProposalStatus.Rejected:
      return <Rejected cast={cast} channel={channel} proposal={proposal} />;
    default:
      return null;
  }
}

function UpvoteAction({ cast, channel, proposal }: CastStatusActionsProps) {
  return (
    <ActionButton
      onPress={() => {
        alert("TODO");
      }}
    >
      <Text className="text-sm">👍</Text>
    </ActionButton>
  );
}
function DownvoteAction({ cast, channel, proposal }: CastStatusActionsProps) {
  return (
    <ActionButton
      onPress={() => {
        alert("TODO");
      }}
    >
      <Text className="text-sm">👎</Text>
    </ActionButton>
  );
}

function NotProposed({ cast, channel, proposal }: CastStatusActionsProps) {
  return (
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">Promising</Text>
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
      <UpvoteAction cast={cast} channel={channel} proposal={proposal} />
    </View>
  );
}

function Proposed({ cast, channel, proposal }: CastStatusActionsProps) {
  const { result, finalizeTime } = proposal;
  return (
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">
        {result === ProposalResult.Downvote ? "👎" : "👍"} finalize in{" "}
        {dayjs(finalizeTime).date(1).format("HH:mm")}
      </Text>
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
      {result === ProposalResult.Downvote ? (
        <UpvoteAction cast={cast} channel={channel} proposal={proposal} />
      ) : (
        <DownvoteAction cast={cast} channel={channel} proposal={proposal} />
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
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
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
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
    </View>
  );
}
