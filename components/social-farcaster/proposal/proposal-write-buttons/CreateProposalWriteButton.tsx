import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "../proposal-modals/CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/onchain-actions/common/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useCreateProposal from "~/hooks/social-farcaster/proposal/useCreateProposal";
import { useAccount, useChainId } from "wagmi";
import { formatUnits, TransactionReceipt } from "viem";
import useProposals from "~/hooks/social-farcaster/proposal/useProposals";
import { Loading } from "~/components/common/Loading";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { TokenWithTradeInfo } from "~/services/trade/types";
import useProxyUserToCreateProposal from "~/hooks/social-farcaster/proposal/useProxyUserToCreateProposal";
import useTipAllowanceToDegencast from "~/hooks/social-farcaster/proposal/useTipAllowanceToDegencast";
import useFarcasterSigner from "~/hooks/social-farcaster/useFarcasterSigner";

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

  const { supportAtomicBatch, getPaymasterService } = useWalletAccount();
  const capabilities = getPaymasterService(paymentTokenInfo?.chainId!);
  const isSupportAtomicBatch = supportAtomicBatch(paymentTokenInfo?.chainId!);

  const chainId = useChainId();
  const allowanceParams =
    !isSupportAtomicBatch &&
    address &&
    isConnected &&
    ATT_CONTRACT_CHAIN.id === chainId
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract!,
          value: paymentAmount,
        }
      : undefined;

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={allowanceParams}
      approveText="👍 Superlike (Approve)"
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
            <Text>👍 Superlike</Text>
          ) : !isConnected ? (
            <Text>Connect your wallet first</Text>
          ) : (
            <Text>👍 Superlike</Text>
          )}
        </Button>
      }
    />
  );
}

export function ProxyUserToCreateProposalButton({
  cast,
  channel,
  tokenInfo,
  onCreateProposalSuccess,
  onCreateProposalError,
  allowanceInfo,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
    onCreateProposalError?: (error: any) => void;
    allowanceInfo: {
      paymentAmount: number;
      totalAllowance: number;
      remainingAllowance: number;
    };
  }) {
  const contractAddress = tokenInfo?.danContract!;
  const { proposals, isLoading: proposalsLoading } = useProposals({
    contractAddress,
    castHash: cast.hash,
  });
  const { isLoading: createLoading, create } = useProxyUserToCreateProposal({
    contractAddress,
    onCreateProposalSuccess,
    onCreateProposalError,
  });

  const {
    requestSigner,
    hasSigner,
    requesting: signerRequesting,
  } = useFarcasterSigner();

  const { isLoading: tipToDegencastIsLoading, tipToDegencast } =
    useTipAllowanceToDegencast();
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const isCreated = Number(proposals?.roundIndex) > 0;
  const isLoading = createLoading || proposalsLoading;

  const { remainingAllowance, paymentAmount } = allowanceInfo;
  const allowanceNotEnough = remainingAllowance < paymentAmount;
  const disabled =
    isCreated ||
    !contractAddress ||
    isLoading ||
    tipToDegencastIsLoading ||
    signerRequesting ||
    allowanceNotEnough;

  return (
    <Button
      variant={"secondary"}
      className="w-full rounded-md"
      disabled={disabled}
      onPress={() => {
        if (!hasSigner) {
          requestSigner();
          return;
        }
        if (!isConnected || !address) {
          connectWallet();
          return;
        }
        tipToDegencast(paymentAmount!, {
          onSuccess: () => {
            create({
              castHash: cast.hash,
              curatorAddr: address,
            });
          },
          onError: (error) => {
            onCreateProposalError?.(error);
          },
        });
      }}
      {...props}
    >
      {isLoading ? (
        <Loading />
      ) : isCreated ? (
        <Text>👍 Superlike</Text>
      ) : !hasSigner ? (
        <Text>Connect Farcaster</Text>
      ) : !isConnected || !address ? (
        <Text>Connect your wallet first</Text>
      ) : (
        <Text>👍 Superlike</Text>
      )}
    </Button>
  );
}
