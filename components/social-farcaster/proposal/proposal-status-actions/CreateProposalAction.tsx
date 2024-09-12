import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import CreateProposalModal, {
  CastProposeStatusProps,
} from "../proposal-modals/CreateProposalModal";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import useAuth from "~/hooks/user/useAuth";

export function CreateProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ProposalButtonProps & CastProposeStatusProps) {
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  const { ready, authenticated, login } = useAuth();
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

  if (!authenticated) {
    return (
      <ProposalButton
        variant={"not-proposed"}
        onPress={() => {
          if (ready) {
            login();
          }
        }}
      >
        {buttonBody}
      </ProposalButton>
    );
  }

  if (!address || !isConnected) {
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
