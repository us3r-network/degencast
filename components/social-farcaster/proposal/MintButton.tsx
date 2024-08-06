import { BuyButton } from "~/components/trade/ATTButton";
import { ProposalButton } from "./ui/proposal-button";
import { ProposalText } from "./ui/proposal-text";
import type { CastStatusActionsProps } from "./CastStatusActions";

export function ReadyToMint({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastStatusActionsProps) {
  const { mintedCount } = proposal;

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
              <ProposalText>Mint {mintedCount}</ProposalText>
            </ProposalButton>
          );
        }}
      />
    )
  );
}
