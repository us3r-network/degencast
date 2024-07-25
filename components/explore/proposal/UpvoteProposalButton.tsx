import { useAccount } from "wagmi";
import { ActionButton } from "~/components/post/PostActions";
import { Text } from "~/components/ui/text";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { CastProposeStatusProps } from "./ChallengeProposalModal";
import { ButtonProps } from "~/components/ui/button";
import UpvoteProposalModal from "./UpvoteProposalModal";

export default function UpvoteProposalButton({
  cast,
  channel,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!account.address) {
    return (
      <ActionButton
        size={"icon"}
        className="rounded-full"
        onPress={() => connectWallet()}
      >
        <Text className="text-sm">👍</Text>
      </ActionButton>
    );
  }

  return (
    <UpvoteProposalModal
      cast={cast}
      channel={channel}
      tokenInfo={tokenInfo}
      triggerButton={
        <ActionButton size={"icon"} className="rounded-full" {...props}>
          <Text className="text-sm">👍</Text>
        </ActionButton>
      }
    />
  );
}
