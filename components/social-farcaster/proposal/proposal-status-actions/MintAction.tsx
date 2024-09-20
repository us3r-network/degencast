import dayjs from "dayjs";
import { View } from "react-native";
import { DiamondPlus } from "~/components/common/Icons";
import { BuyButton } from "~/components/trade/ATTBuyButton";
import useCacheCastProposal from "~/hooks/social-farcaster/proposal/useCacheCastProposal";
import { Deadline, MintCount } from "../ProposalStyled";
import { ProposalButton } from "../ui/proposal-button";
import { ProposalText } from "../ui/proposal-text";
import type { ProposalStatusActionsProps } from "./ProposalStatusActions";
import ExpiredNftModal from "../proposal-modals/ExpiredNftModal";

export function ReadyToMintButton({
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
      <ExpiredNftModal
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
        triggerButton={
          <ProposalButton variant={"mint-expired"}>
            <ProposalText>End</ProposalText>
          </ProposalButton>
        }
      />
    );
  }
  return (
    tokenInfo?.tokenContract &&
    proposal.tokenId && (
      <BuyButton
        token={{
          contractAddress: tokenInfo.tokenContract,
          tokenId: Number(proposal.tokenId),
        }}
        cast={cast}
        renderButton={(props) => {
          return (
            <ProposalButton variant={"ready-to-mint"} {...props}>
              <DiamondPlus className="size-4 stroke-proposalReadyToMint-foreground" />
              <ProposalText>Mint</ProposalText>
            </ProposalButton>
          );
        }}
        onSuccess={(newMintNFTAmount) => {
          // console.log("newMintNFTAmount", newMintNFTAmount, proposal);
          upsertOneToProposals(cast.hash as `0x${string}`, {
            ...proposal,
            mintedCount: Number(proposal.mintedCount || 0) + newMintNFTAmount,
          });
        }}
      />
    )
  );
}

export function ReadyToMintActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  const mintedCount = isNaN(Number(proposal?.mintedCount))
    ? 0
    : Number(proposal?.mintedCount);
  return (
    <View className="flex flex-row items-center gap-4">
      <MintCount count={mintedCount} />
      {proposal?.nftDeadline && (
        <Deadline timestamp={Number(proposal.nftDeadline)} />
      )}

      <ReadyToMintButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
