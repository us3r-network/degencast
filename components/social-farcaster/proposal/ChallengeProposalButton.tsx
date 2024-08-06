import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import ChallengeProposalModal, {
  CastProposeStatusProps,
} from "./ChallengeProposalModal";
import { ProposalButtonBody } from "./ProposalButtonBody";
import { ProposalButton, ProposalButtonProps } from "./ui/proposal-button";
import { ProposalState } from "~/hooks/social-farcaster/proposal/proposal-helper";

export default function ChallengeProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ProposalButtonProps & CastProposeStatusProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!proposal) return null;
  const { status } = proposal;
  const buttonVariant =
    status === ProposalState.Disputed ? "disputed" : "accepted";
  const buttonBody = (
    <ProposalButtonBody
      cast={cast}
      channel={channel}
      proposal={proposal!}
      tokenInfo={tokenInfo}
    />
  );
  if (!isConnected) {
    return (
      <ProposalButton variant={buttonVariant} onPress={() => connectWallet()}>
        {buttonBody}
      </ProposalButton>
    );
  }

  return (
    <ChallengeProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ProposalButton variant={buttonVariant} {...props}>
          {buttonBody}
        </ProposalButton>
      }
    />
  );
}
