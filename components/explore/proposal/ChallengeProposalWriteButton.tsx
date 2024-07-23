import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "./CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import { ATT_CONTRACT_CHAIN } from "~/constants/att";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import useProposeProposal from "~/hooks/social-farcaster/proposal/useProposeProposal";
import useDisputeProposal from "~/hooks/social-farcaster/proposal/useDisputeProposal";

export function ProposeProposalWriteButton({
  cast,
  tokenInfo,
  price,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    price: bigint;
  }) {
  const { isLoading, propose } = useProposeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const account = useAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const allowanceParams =
    account?.address &&
    tokenInfo?.danContract &&
    paymentTokenInfo?.address &&
    price
      ? {
          owner: account.address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract!,
          value: price,
        }
      : undefined;

  console.log("account?.address", account?.address);
  console.log("paymentTokenInfo?.address", paymentTokenInfo?.address);
  console.log("price", price);

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={allowanceParams}
      warpedButton={
        <Button
          variant={"secondary"}
          className="w-full rounded-md"
          disabled={!price || paymentTokenInfoLoading || isLoading}
          onPress={() => {
            propose();
          }}
          {...props}
        >
          <Text>Challenge</Text>
        </Button>
      }
    />
  );
}

export function DisputeProposalWriteButton({
  cast,
  tokenInfo,
  price,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    price: bigint;
  }) {
  const { isLoading, dispute } = useDisputeProposal({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
  const account = useAccount();
  const { paymentTokenInfo, isLoading: paymentTokenInfoLoading } =
    usePaymentTokenInfo({
      contractAddress: tokenInfo?.danContract!,
      castHash: cast.hash,
    });
  const allowanceParams =
    account?.address &&
    tokenInfo?.danContract &&
    paymentTokenInfo?.address &&
    price
      ? {
          owner: account.address,
          tokenAddress: paymentTokenInfo?.address,
          spender: tokenInfo?.danContract!,
          value: price,
        }
      : undefined;

  console.log("account?.address", account?.address);
  console.log("paymentTokenInfo?.address", paymentTokenInfo?.address);
  console.log("price", price);

  return (
    <OnChainActionButtonWarper
      variant="secondary"
      className="w-full"
      targetChainId={ATT_CONTRACT_CHAIN.id}
      allowanceParams={allowanceParams}
      warpedButton={
        <Button
          variant={"secondary"}
          className="w-full rounded-md"
          disabled={!price || paymentTokenInfoLoading || isLoading}
          onPress={() => {
            dispute();
          }}
          {...props}
        >
          <Text>Challenge</Text>
        </Button>
      }
    />
  );
}
