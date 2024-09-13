import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "../proposal-modals/CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useCreateProposal from "~/hooks/social-farcaster/proposal/useCreateProposal";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { formatUnits, TransactionReceipt } from "viem";
import { getProposalMinPrice } from "../utils";
import useProposals from "~/hooks/social-farcaster/proposal/useProposals";
import { Loading } from "~/components/common/Loading";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { TokenWithTradeInfo } from "~/services/trade/types";

export default function CreateProposalWriteButton({
  cast,
  channel,
  tokenInfo,
  paymentTokenInfo,
  usedPaymentTokenInfo,
  paymentTokenInfoLoading,
  paymentAmount,
  onCreateProposalSuccess,
  onCreateProposalError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    paymentTokenInfo: TokenWithTradeInfo;
    usedPaymentTokenInfo?: TokenWithTradeInfo;
    paymentTokenInfoLoading?: boolean;
    paymentAmount: bigint;
    onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
    onCreateProposalError?: (error: any) => void;
  }) {
  const { proposals, isLoading: proposalsLoading } = useProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const { isLoading: createLoading, create } = useCreateProposal({
    contractAddress: tokenInfo?.danContract!,
    onCreateProposalSuccess,
    onCreateProposalError,
  });
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  // const paymentAmount = getProposalMinPrice(tokenInfo, paymentTokenInfo);
  const isCreated = Number(proposals?.roundIndex) > 0;
  const isLoading =
    createLoading || proposalsLoading || paymentTokenInfoLoading;

  const payAmountNumber =
    usedPaymentTokenInfo && usedPaymentTokenInfo?.decimals
      ? Number(formatUnits(paymentAmount, usedPaymentTokenInfo?.decimals!))
      : 0;
  const maxAmountNumber = usedPaymentTokenInfo?.rawBalance
    ? Number(
        formatUnits(
          usedPaymentTokenInfo?.rawBalance as any,
          usedPaymentTokenInfo?.decimals!,
        ),
      )
    : 0;

  const disabled =
    isCreated ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    isLoading ||
    !paymentAmount ||
    payAmountNumber > maxAmountNumber;

  const allowanceParams =
    !disabled && address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract!,
          value: paymentAmount,
        }
      : undefined;

  const { supportAtomicBatch, getPaymasterService } = useWalletAccount();
  const capabilities = getPaymasterService(paymentTokenInfo?.chainId!);
  const isSupportAtomicBatch = supportAtomicBatch(paymentTokenInfo?.chainId!);

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={isSupportAtomicBatch ? undefined : allowanceParams}
      warpedButton={
        <Button
          variant={"secondary"}
          className="w-full rounded-md"
          disabled={disabled}
          onPress={() => {
            if (!isConnected) {
              connectWallet();
              return;
            }
            create(
              {
                castHash: cast.hash,
                castCreator: String(
                  cast.author.verified_addresses.eth_addresses[0] ||
                    cast.author.custody_address,
                ) as `0x${string}`,
              },
              {
                paymentTokenAddress: paymentTokenInfo?.address,
                paymentAmount: paymentAmount!,
                ...(isSupportAtomicBatch
                  ? {
                      enableApprovePaymentStep: true,
                      capabilities,
                      paymentToken: paymentTokenInfo,
                      usedPaymentToken: usedPaymentTokenInfo,
                    }
                  : {}),
              },
            );
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : isCreated ? (
            <Text>Upvoted</Text>
          ) : !isConnected ? (
            <Text>Connect your wallet first</Text>
          ) : (
            <Text>Upvote</Text>
          )}
        </Button>
      }
    />
  );
}
