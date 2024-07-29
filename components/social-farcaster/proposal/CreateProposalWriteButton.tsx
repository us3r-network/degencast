import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "./CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import useCreateProposal from "~/hooks/social-farcaster/proposal/useCreateProposal";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import { TransactionReceipt } from "viem";
import { getProposalMinPrice } from "./utils";
import useProposals from "~/hooks/social-farcaster/proposal/useProposals";
import { Loading } from "~/components/common/Loading";
import useWalletAccount from "~/hooks/user/useWalletAccount";

export default function CreateProposalWriteButton({
  cast,
  channel,
  tokenInfo,
  onCreateProposalSuccess,
  onCreateProposalError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
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
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const price = getProposalMinPrice(tokenInfo, paymentTokenInfo);
  const isCreated = Number(proposals?.roundIndex) > 0;
  const isLoading =
    createLoading || proposalsLoading || paymentTokenInfoLoading;
  const disabled =
    isCreated ||
    !tokenInfo?.danContract ||
    !paymentTokenInfo?.address ||
    isLoading ||
    !price;
  const allowanceParams =
    !disabled && address && isConnected
      ? {
          owner: address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract!,
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
            create(
              {
                castHash: cast.hash,
                castCreator: String(
                  cast.author.verified_addresses.eth_addresses[0],
                ) as `0x${string}`,
              },
              price!,
            );
          }}
          {...props}
        >
          {isLoading ? (
            <Loading />
          ) : isCreated ? (
            <Text>Proposal created</Text>
          ) : !isConnected ? (
            <Text>Connect your wallet first</Text>
          ) : (
            <Text>Propose</Text>
          )}
        </Button>
      }
    />
  );
}
