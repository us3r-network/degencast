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
  const { address, isConnected } = useAccount();
  const { connectWallet } = useWalletAccount();
  if (!isConnected) {
    return (
      <ActionButton
        size={"icon"}
        className="h-8  w-auto min-w-[60px] rounded-lg px-1"
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
        <ActionButton
          className="h-8  w-auto min-w-[60px] rounded-lg px-1"
          {...props}
        >
          <Text className="text-sm">
            👍{Number(proposal?.upvoteCount) > 0 ? proposal.upvoteCount : ""}
          </Text>
        </ActionButton>
      }
    />
  );
}
