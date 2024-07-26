import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { ProposalEntity } from "~/services/feeds/types/proposal";
import { TokenWithTradeInfo } from "~/services/trade/types";

const CREATE_PROPOSAL_MIN_PRICE = 300;
export const getProposalMinPrice = (
  tokenInfo: AttentionTokenEntity | undefined,
  paymentTokenInfo: TokenWithTradeInfo | undefined,
) => {
  if (!paymentTokenInfo?.decimals) {
    return undefined;
  }
  return BigInt(
    `${CREATE_PROPOSAL_MIN_PRICE}${"0".repeat(paymentTokenInfo?.decimals!)}`,
  );
};

export const displayProposalActions = ({
  channel,
  tokenInfo,
  proposal,
}: {
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
}) => {
  return !!(
    !!channel?.channelId &&
    channel.channelId !== "home" &&
    !!tokenInfo?.danContract &&
    !!tokenInfo?.bondingCurve?.basePrice &&
    proposal
  );
};
