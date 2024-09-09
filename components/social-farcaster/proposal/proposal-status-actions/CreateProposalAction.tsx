import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import CreateProposalModal, {
  CastProposeStatusProps,
} from "../proposal-modals/CreateProposalModal";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";

export function CreateProposalButton({
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
      hideDownvote
      cast={cast}
      channel={channel}
      proposal={proposal!}
      tokenInfo={tokenInfo}
    />
  );
  if (!isConnected) {
    return (
      <ProposalButton variant={"not-proposed"} onPress={() => connectWallet()}>
        {buttonBody}
      </ProposalButton>
    );
  }

  return (
    <CreateProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ProposalButton variant={"not-proposed"} {...props}>
          {buttonBody}
        </ProposalButton>
      }
    />
  );
}
