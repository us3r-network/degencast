import { TransactionExecutionError } from "viem";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { CommunityEntity } from "~/services/community/types/community";
import { NeynarCast } from "~/services/farcaster/types/neynar";
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

export const getProposalPriceWithAmount = (
  price: number,
  paymentTokenInfo: TokenWithTradeInfo,
) => {
  if (!paymentTokenInfo?.decimals) {
    return undefined;
  }
  const priceBigInt = BigInt(price * 10 ** paymentTokenInfo?.decimals);
  return priceBigInt;
};

export const displayProposalActions = ({
  cast,
  channel,
  tokenInfo,
  proposal,
}: {
  cast: NeynarCast;
  channel: CommunityEntity;
  proposal: ProposalEntity;
  tokenInfo?: AttentionTokenEntity;
}) => {
  return !!(
    !!channel?.channelId &&
    !!tokenInfo?.danContract &&
    !!tokenInfo?.danConfig?.proposalStake &&
    !!proposal &&
    cast.author?.verified_addresses?.eth_addresses.length > 0 &&
    cast.author?.verified_addresses?.eth_addresses?.[0]
  );
};

export const getProposalErrorInfo = (e: any) => {
  const errorInfo = {
    shortMessage: "",
    message: "",
  };
  if (e instanceof TransactionExecutionError) {
    const { ...err } = e;
    console.log("TransactionExecutionError", err);
    const { cause, message, details } = err;
    const { code } = cause as any;
    // 用户拒绝交易
    if (code === 4001) {
      errorInfo.shortMessage = "Transaction canceled";
    } else {
      errorInfo.shortMessage = details;
      errorInfo.message = message;
    }
  } else {
    errorInfo.shortMessage = e.message;
  }
  return errorInfo;
};
