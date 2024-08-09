import { BuyButton } from "~/components/trade/ATTButton";
import { ProposalButton } from "../ui/proposal-button";
import { ProposalText } from "../ui/proposal-text";
import type { ProposalStatusActionsProps } from "./ProposalStatusActions";
import dayjs from "dayjs";
import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { AlarmClockIcon, DiamondPlus } from "~/components/common/Icons";
import { Deadline, MintCount } from "../ProposalStyled";

export function ReadyToMintButton({
  proposal,
  tokenInfo,
}: ProposalStatusActionsProps) {
  const { nftDeadline } = proposal;
  const nftDeadlineTime = Number(nftDeadline);
  const now = dayjs().unix();
  const isExpired = nftDeadlineTime < now;

  if (isExpired) {
    return (
      <ProposalButton variant={"mint-expired"}>
        {" "}
        <ProposalText>End</ProposalText>
      </ProposalButton>
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
        renderButton={(props) => {
          return (
            <ProposalButton variant={"ready-to-mint"} {...props}>
              <ProposalText>Mint</ProposalText>
            </ProposalButton>
          );
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
    : Number(proposal?.upvoteCount);
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
