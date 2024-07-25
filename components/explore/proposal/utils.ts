import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { TokenWithTradeInfo } from "~/services/trade/types";

export const getProposalMinPrice = (
  tokenInfo: AttentionTokenEntity | undefined,
  paymentTokenInfo: TokenWithTradeInfo | undefined,
) => {
  if (!tokenInfo?.bondingCurve.basePrice || !paymentTokenInfo?.decimals) {
    return undefined;
  }
  return BigInt(`${300}${"0".repeat(paymentTokenInfo?.decimals!)}`);
};
