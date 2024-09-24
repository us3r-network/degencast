import { ChannelShareGlobalModal } from "./platform-sharing/GlobalSharingModals";
import InviteCodeModal from "./portfolio/onboarding/InviteCodeModal";
import OnboardingModal from "./portfolio/onboarding/Onboarding";
import ProposalShareGlobalModal from "./social-farcaster/proposal/proposal-modals/ProposalShareGlobalModal";
import { TradeTokenGlobalModal } from "./onchain-actions/swap/TradeModal";

export default function GlobalModals() {
  return (
    <>
      <OnboardingModal />
      <InviteCodeModal />
      <ProposalShareGlobalModal />
      <TradeTokenGlobalModal />
      <ChannelShareGlobalModal />
    </>
  );
}
