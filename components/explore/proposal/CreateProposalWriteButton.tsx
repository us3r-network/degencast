import { Text } from "~/components/ui/text";
import { CastProposeStatusProps } from "./CreateProposalModal";
import { Button, ButtonProps } from "~/components/ui/button";
import OnChainActionButtonWarper from "~/components/trade/OnChainActionButtonWarper";
import {
  ATT_CONTRACT_CHAIN,
  ATT_FACTORY_CONTRACT_ADDRESS,
} from "~/constants/att";
import useCreateProposal from "~/hooks/social-farcaster/proposal/useCreateProposal";
import { useAccount } from "wagmi";
import usePaymentTokenInfo from "~/hooks/social-farcaster/proposal/usePaymentTokenInfo";
import useProposePrice from "~/hooks/social-farcaster/proposal/useProposePrice";
import { TransactionReceipt } from "viem";

export default function CreateProposalWriteButton({
  cast,
  channel,
  tokenInfo,
  text,
  onCreateProposalSuccess,
  onCreateProposalError,
  ...props
}: ButtonProps &
  CastProposeStatusProps & {
    text?: string;
    onCreateProposalSuccess?: (proposal: TransactionReceipt) => void;
    onCreateProposalError?: (error: any) => void;
  }) {
  const { isLoading, create } = useCreateProposal({
    contractAddress: tokenInfo?.danContract!,
    onCreateProposalSuccess,
    onCreateProposalError,
  });
  const account = useAccount();
  const { price, isLoading: priceLoading } = useProposePrice({
    contractAddress: tokenInfo?.danContract!,
    castHash: cast.hash,
  });
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
          disabled={priceLoading || paymentTokenInfoLoading || isLoading}
          onPress={() => {
            console.log("author", cast.author);

            create({
              castHash: cast.hash,
              castCreator: String(
                cast.author.verified_addresses.eth_addresses[0],
              ) as `0x${string}`,
            });
          }}
          {...props}
        >
          <Text>{text || "Propose"}</Text>
        </Button>
      }
    />
  );
}
