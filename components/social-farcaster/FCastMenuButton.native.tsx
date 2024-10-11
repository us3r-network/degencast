import { ViewProps } from "react-native";
import { CommunityInfo } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
import { ProposalEntity } from "~/services/feeds/types/proposal";

export default function FCastMenuButton({
  direction,
  cast,
  communityInfo,
  proposal,
  ...props
}: ViewProps & {
  direction?: "top" | "left" | "right";
  cast: NeynarCast;
  communityInfo: CommunityInfo;
  proposal?: ProposalEntity;
}) {
  return null;
}