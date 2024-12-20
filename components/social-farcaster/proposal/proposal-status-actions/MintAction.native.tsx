import dayjs from "dayjs";
import { View } from "react-native";
import { DiamondPlus } from "~/components/common/Icons";
import { BuyButton } from "~/components/onchain-actions/att/ATTBuyButton";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import { Deadline, LikeCount, MintCount } from "../ProposalStyled";
import { ProposalButton } from "../ui/proposal-button";
import { ProposalText } from "../ui/proposal-text";
import type { ProposalStatusActionsProps } from "./ProposalStatusActions";
import { ExpiredNftButton } from "../proposal-modals/ExpiredNftModal";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";

function ReadyToMintButton({
  cast,
  channel,
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  const { nftDeadline } = proposal;
  const nftDeadlineTime = Number(nftDeadline);
  const now = dayjs().unix();
  const isExpired = nftDeadlineTime < now;
  const { upsertOneToProposals } = useCacheCastProposal();
  if (isExpired) {
    return (
      <ExpiredNftButton
        className="w-full"
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        renderButton={(props: any) => {
          return (
            <ProposalButton variant={"mint-expired"} {...props}>
              <ProposalText>End</ProposalText>
            </ProposalButton>
          );
        }}
      />
    );
  }
  return (
    tokenInfo?.tokenContract &&
    proposal.tokenId && (
      <ProposalButton variant={"ready-to-mint"} disabled>
        {/* <DiamondPlus className="size-4 stroke-proposalReadyToMint-foreground" /> */}
        <ProposalText>
          Mint for $
          {channel.channelId === "home"
            ? "CAST"
            : channel.channelId?.toLocaleUpperCase()}
           (WEB ONLY)
        </ProposalText>
      </ProposalButton>
    )
  );
}

export function ReadyToMintActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  // const { likeCount } = useFarcasterLikeAction({ cast });
  // const mintedCount = isNaN(Number(proposal?.mintedCount))
  //   ? 0
  //   : Number(proposal?.mintedCount);
  return (
    <View className="flex w-full flex-row items-center gap-4">
      {/* <MintCount count={mintedCount} />
      {proposal?.nftDeadline && (
        <Deadline timestamp={Number(proposal.nftDeadline)} />
      )}
      <LikeCount count={likeCount || 0} /> */}
      <ReadyToMintButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
