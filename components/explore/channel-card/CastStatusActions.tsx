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
import ProposeButton from "../proposal/ProposeButton";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";

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
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
      <ProposeButton
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
  const { result, finalizeTime } = proposal;
  return (
    <View className="flex w-full flex-row items-center gap-4">
      <Text className="mr-auto text-sm text-secondary">
        {result === ProposalResult.Downvote ? "👎" : "👍"} finalize in{" "}
        {dayjs(finalizeTime).date(1).format("HH:mm")}
      </Text>
      <FCastExploreActions cast={cast} communityInfo={channel as any} />
      <ProposeButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
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