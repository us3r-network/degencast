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
  proposal,
  tokenInfo,
  ...props
}: ButtonProps & CastProposeStatusProps) {
  const account = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!account.address) {
    return (
      <ActionButton
        size={"icon"}
        className="h-8 rounded-lg"
        onPress={() => connectWallet()}
      >
        <Text className="text-sm">
          👍{Number(proposal?.upvoteCount) > 0 ? proposal.upvoteCount : ""}
        </Text>
      </ActionButton>
    );
  }

  return (
    <UpvoteProposalModal
      cast={cast}
      channel={channel}
      tokenInfo={tokenInfo}
      triggerButton={
        <ActionButton size={"icon"} className="h-8  rounded-lg" {...props}>
          <Text className="text-sm">
            👍{Number(proposal?.upvoteCount) > 0 ? proposal.upvoteCount : ""}
          </Text>
        </ActionButton>
      }
    />
  );
}
