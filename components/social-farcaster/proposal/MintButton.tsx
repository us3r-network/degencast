import { BuyButton } from "~/components/trade/ATTButton";
import { ProposalButton } from "./ui/proposal-button";
import { ProposalText } from "./ui/proposal-text";
import type { CastStatusActionsProps } from "./CastStatusActions";
import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import dayjs from "dayjs";

export function ReadyToMint({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { mintedCount, nftDeadline } = proposal;
  const nftDeadlineTime = Number(nftDeadline);
  const now = dayjs().unix();
  const isExpired = nftDeadlineTime < now;
  const mintButtonBody = (
    <View className="flex flex-row items-center gap-1">
      <ProposalText>
        {mintedCount ? `Minted ${mintedCount}` : "Mint"}
      </ProposalText>
      {nftDeadlineTime && (
        <>
          <Separator
            orientation="vertical"
            className={cn(
              " mx-1 h-[12px] w-[1.5px]",
              isExpired
                ? "bg-proposalMintExpired-foreground"
                : "bg-proposalReadyToMint-foreground",
            )}
          />
          <ProposalText>
            {isExpired
              ? "Expired"
              : dayjs(nftDeadlineTime * 1000).format("MM/DD HH:mm:ss")}
          </ProposalText>
        </>
      )}
    </View>
  );

  if (isExpired) {
    return (
      <ProposalButton variant={"mint-expired"}>{mintButtonBody}</ProposalButton>
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
              {mintButtonBody}
            </ProposalButton>
          );
        }}
      />
    )
  );
}
