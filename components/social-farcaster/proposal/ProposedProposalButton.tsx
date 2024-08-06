import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { CastProposeStatusProps } from "./ChallengeProposalModal";
import { ProposalButton, ProposalButtonProps } from "./ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import ProposedProposalModal from "./ProposedProposalModal";

export default function ProposedProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ProposalButtonProps & CastProposeStatusProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!proposal) return null;
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
      <ProposalButton variant={"proposed"} onPress={() => connectWallet()}>
        {buttonBody}
      </ProposalButton>
    );
  }

  return (
    <ProposedProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ProposalButton variant={"proposed"} {...props}>
          {buttonBody}
        </ProposalButton>
      }
    />
  );
}
