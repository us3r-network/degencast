import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "../proposal-modals/CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import useProposeProposal from "~/hooks/social-farcaster/proposal/useProposeProposal";
import useDisputeProposal from "~/hooks/social-farcaster/proposal/useDisputeProposal";
import { formatUnits, TransactionReceipt } from "viem";
import { Loading } from "~/components/common/Loading";
import useRoundProposals from "~/hooks/social-farcaster/proposal/useRoundProposals";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";
import { TokenWithTradeInfo } from "~/services/trade/types";

export function ProposeProposalWriteButton({
  cast,
  tokenInfo,
  proposal,
  paymentTokenInfo,
  usedPaymentTokenInfo,
  paymentTokenInfoLoading,
  paymentAmount,
  approveText,
  upvoteText,
  onProposeSuccess,
  onProposeError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    paymentTokenInfo: TokenWithTradeInfo;
    usedPaymentTokenInfo?: TokenWithTradeInfo;
    paymentTokenInfoLoading?: boolean;
    paymentAmount: bigint;
    approveText?: string;
    upvoteText?: string;
    onProposeSuccess?: (proposal: TransactionReceipt) => void;
    onProposeError?: (error: any) => void;
  }) {
  const {
    participated,
    isLoading: proposalsLoading,
    proposals,
  } = useRoundProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const { isLoading: proposeLoading, propose } = useProposeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    proposal,
    onProposeSuccess,
    onProposeError,
  });
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const isLoading =
    proposeLoading || proposalsLoading || paymentTokenInfoLoading;

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
    participated ||
    proposals?.state === ProposalState.Abandoned ||
    (proposals?.state === ProposalState.Accepted &&
      Number(proposals.roundIndex) > 1) ||
    proposals?.state === ProposalState.ReadyToMint ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    isLoading ||
    !paymentAmount ||
    payAmountNumber > maxAmountNumber;

  const allowanceParams =
    !disabled && !!address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract,
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
      allowanceParams={allowanceParams}
      approveText={approveText}
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
            propose({
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
            });
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : participated ? (
            proposals?.state === ProposalState.Accepted ? (
              <Text>You have already voted.</Text>
            ) : (
              <Text>You can only vote once in this round.</Text>
            )
          ) : proposals?.state === ProposalState.ReadyToMint ? (
            <Text>The proposal has been passed</Text>
          ) : proposals?.state === ProposalState.Abandoned ? (
            <Text>The proposal has been abandoned</Text>
          ) : proposals?.state === ProposalState.Accepted ? (
            Number(proposals?.roundIndex) <= 1 ? (
              <Text>{upvoteText || "Upvote & Accelerate Countdown"}</Text>
            ) : (
              <Text>The proposal has been accepted</Text>
            )
          ) : !isConnected ? (
            <Text>Connect your wallet first</Text>
          ) : (
            <Text>{upvoteText || "Upvote & Accelerate Countdown"}</Text>
          )}
        </Button>
      }
    />
  );
}

export function DisputeProposalWriteButton({
  cast,
  tokenInfo,
  proposal,
  paymentTokenInfo,
  usedPaymentTokenInfo,
  paymentTokenInfoLoading,
  paymentAmount,
  approveText,
  downvoteText,
  onDisputeSuccess,
  onDisputeError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    paymentTokenInfo: TokenWithTradeInfo;
    usedPaymentTokenInfo?: TokenWithTradeInfo;
    paymentTokenInfoLoading?: boolean;
    paymentAmount: bigint;
    approveText?: string;
    downvoteText?: string;
    onDisputeSuccess?: (proposal: TransactionReceipt) => void;
    onDisputeError?: (error: any) => void;
  }) {
  const {
    proposals,
    isLoading: proposalsLoading,
    participated,
  } = useRoundProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  // const { proposals, isLoading: proposalsLoading } = useProposals({
  //   contractAddress: tokenInfo?.danContract!,
  //   castHash: cast.hash,
  // });
  const { isLoading: disputeLoading, dispute } = useDisputeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    proposal,
    onDisputeSuccess,
    onDisputeError,
  });
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const isLoading =
    disputeLoading || proposalsLoading || paymentTokenInfoLoading;

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
    participated ||
    proposals?.state === ProposalState.Abandoned ||
    proposals?.state === ProposalState.Disputed ||
    proposals?.state === ProposalState.ReadyToMint ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    isLoading ||
    !paymentAmount ||
    payAmountNumber > maxAmountNumber;

  const allowanceParams =
    !disabled && !!address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract,
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
      approveText={approveText}
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
            dispute({
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
            });
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : participated ? (
            proposals?.state === ProposalState.Disputed ? (
              <Text>You have already disputed</Text>
            ) : (
              <Text>You can only vote once in this round.</Text>
            )
          ) : proposals?.state === ProposalState.ReadyToMint ? (
            <Text>The proposal has been passed</Text>
          ) : proposals?.state === ProposalState.Abandoned ? (
            <Text>The proposal has been abandoned</Text>
          ) : proposals?.state === ProposalState.Disputed ? (
            <Text>The proposal has been disputed</Text>
          ) : !isConnected ? (
            <Text>Connect Wallet</Text>
          ) : (
            <Text>{downvoteText || "Challenge"}</Text>
          )}
        </Button>
      }
    />
  );
}
