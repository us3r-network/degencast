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
  const { isLoading, propose } = useProposeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    onProposeSuccess,
    onProposeError,
  });
  const account = useAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const disabled =
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    paymentTokenInfoLoading ||
    isLoading ||
    !price;
  const allowanceParams =
    !disabled && account?.address
      ? {
          owner: account.address,
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
            propose();
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <Text>{text || "Upvote & Accelerate Countdown"}</Text>
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
  const { proposals, isLoading: proposalsLoading } = useProposals({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const { isLoading, dispute } = useDisputeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
    onDisputeSuccess,
    onDisputeError,
  });
  const account = useAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const disabled =
    proposalsLoading ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    paymentTokenInfoLoading ||
    isLoading ||
    !price;
  const allowanceParams =
    !disabled && account?.address
      ? {
          owner: account.address,
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
            if (Number(proposals?.roundIndex) < 2) {
              Toast.show({
                type: "error",
                text1: "Dispute is not allowed in the first round",
              });
            } else {
              dispute();
            }
          }}
          {...props}
        >
          {isLoading ? <Loading /> : <Text>{text || "Challenge"}</Text>}
        </Button>
      }
    />
  );
}
