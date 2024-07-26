import { AttentionTokenEntity } from "~/services/community/types/attention-token";
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
