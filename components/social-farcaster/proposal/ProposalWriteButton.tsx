import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "./CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import useProposeProposal from "~/hooks/social-farcaster/proposal/useProposeProposal";
import useDisputeProposal from "~/hooks/social-farcaster/proposal/useDisputeProposal";
import { TransactionReceipt } from "viem";
import { Loading } from "~/components/common/Loading";
import useProposals from "~/hooks/social-farcaster/proposal/useProposals";
import Toast from "react-native-toast-message";
import useRoundProposals from "~/hooks/social-farcaster/proposal/useRoundProposals";
import useWalletAccount from "~/hooks/user/useWalletAccount";

export function ProposeProposalWriteButton({
  cast,
  tokenInfo,
  price,
  text,
  onProposeSuccess,
  onProposeError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    price: bigint;
    text?: string;
    onProposeSuccess?: (proposal: TransactionReceipt) => void;
    onProposeError?: (error: any) => void;
  }) {
  const { participated, isLoading: proposalsLoading } = useRoundProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const { isLoading, propose } = useProposeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    onProposeSuccess,
    onProposeError,
  });
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const disabled =
    participated ||
    proposalsLoading ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    paymentTokenInfoLoading ||
    isLoading ||
    !price;
  const allowanceParams =
    !disabled && !!address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract,
          value: price,
        }
      : undefined;

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={allowanceParams}
      disabled={disabled}
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
            propose();
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : !isConnected ? (
            <Text>Connect Wallet</Text>
          ) : (
            <Text>
              {participated ? "Voted" : text || "Upvote & Accelerate Countdown"}
            </Text>
          )}
        </Button>
      }
    />
  );
}

export function DisputeProposalWriteButton({
  cast,
  tokenInfo,
  price,
  text,
  onDisputeSuccess,
  onDisputeError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    price: bigint;
    text?: string;
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
  const { isLoading, dispute } = useDisputeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    onDisputeSuccess,
    onDisputeError,
  });
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const disabled =
    participated ||
    proposalsLoading ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    paymentTokenInfoLoading ||
    isLoading ||
    !price;
  const allowanceParams =
    !disabled && !!address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract,
          value: price,
        }
      : undefined;

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={allowanceParams}
      disabled={disabled}
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
            dispute();
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : !isConnected ? (
            <Text>Connect Wallet</Text>
          ) : (
            <Text>{participated ? "Disputed" : text || "Challenge"}</Text>
          )}
        </Button>
      }
    />
  );
}
