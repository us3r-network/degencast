import { useAccount } from "wagmi";
import useWalletAccount from "~/hooks/user/useWalletAccount";
import { CastProposeStatusProps } from "../proposal-modals/ChallengeProposalModal";
import { ProposalButton, ProposalButtonProps } from "../ui/proposal-button";
import { ProposalButtonBody } from "./ProposalButtonBody";
import ProposedProposalModal from "../proposal-modals/ProposedProposalModal";
import { View } from "react-native";
import { Deadline, LikeCount } from "../ProposalStyled";
import useAuth from "~/hooks/user/useAuth";
import useFarcasterLikeAction from "~/hooks/social-farcaster/useFarcasterLikeAction";

export function ProposedProposalButton({
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
      cast={cast}
      channel={channel}
      proposal={proposal!}
      tokenInfo={tokenInfo}
    />
  );

  if (!authenticated) {
    return (
      <ProposalButton
        variant={"proposed"}
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

export function ProposedProposalActionLayout({
  cast,
  channel,
  proposal,
  tokenInfo,
}: CastProposeStatusProps) {
  const { likeCount } = useFarcasterLikeAction({ cast });
  return (
    <View className="flex flex-row items-center gap-4">
      {proposal?.finalizeTime && (
        <Deadline timestamp={proposal?.finalizeTime} />
      )}
      <LikeCount count={likeCount || 0} />

      <ProposedProposalButton
        cast={cast}
        channel={channel}
        proposal={proposal}
        tokenInfo={tokenInfo}
      />
    </View>
  );
}
