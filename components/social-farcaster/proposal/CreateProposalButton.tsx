import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import CreateProposalModal, {
  CastProposeStatusProps,
} from "./CreateProposalModal";
import { ButtonProps } from "~/components/ui/button";

export default function CreateProposalButton({
  cast,
  channel,
  proposal,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!account.address) {
    return (
      <ActionButton
        className="h-8  w-auto rounded-lg px-1"
        onPress={() => connectWallet()}
      >
        <Text className="text-sm">Propose</Text>
      </ActionButton>
    );
  }

  return (
    <CreateProposalModal
      cast={cast}
      channel={channel}
      proposal={proposal}
      tokenInfo={tokenInfo}
      triggerButton={
        <ActionButton className="h-8  w-auto rounded-lg px-1" {...props}>
          <Text className="text-sm">Propose</Text>
        </ActionButton>
      }
    />
  );
}
