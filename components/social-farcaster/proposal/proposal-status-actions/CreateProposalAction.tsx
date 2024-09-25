import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import CreateProposalModal, {
  CastProposeStatusProps,
} from "../proposal-modals/CreateProposalModal";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import useAuth from "~/hooks/user/useAuth";
import { View } from "react-native";
import { ProposalText } from "../ui/proposal-text";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";
import { LikeCount } from "../ProposalStyled";

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
    <View className="flex flex-row items-center gap-1">
      <ProposalText>👍</ProposalText>
      <ProposalText>Superlike</ProposalText>
    </View>
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

export function CreateProposalActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastProposeStatusProps) {
  const { likeCount } = useFarcasterLikeAction({ cast });
  return (
    <View className="flex flex-row items-center gap-4">
      <LikeCount count={likeCount || 0} />

      <CreateProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
