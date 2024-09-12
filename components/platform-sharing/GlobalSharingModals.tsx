import useAppModals from "~/hooks/useAppModals";
import PlatformSharingModal from "./PlatformSharingModal";
import useFarcasterAccount from "~/hooks/social-farcaster/useFarcasterAccount";
import {
  getCommunityShareTextWithTwitter,
  getCommunityShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import {
  getCommunityFrameLink,
  getCommunityWebsiteLink,
} from "~/utils/platform-sharing/link";

export function ChannelShareGlobalModal() {
  const { channelShareModal, setChannelShareModal } = useAppModals();
  const { currFid } = useFarcasterAccount();
  const { open, channelId, name } = channelShareModal;
  return (
    <PlatformSharingModal
      open={open}
      onOpenChange={(open) =>
        setChannelShareModal({
          open,
          channelId: "",
          name: "",
        })
      }
      text={""}
      twitterText={getCommunityShareTextWithTwitter(name || "")}
      warpcastText={getCommunityShareTextWithWarpcast(name || "")}
      websiteLink={getCommunityWebsiteLink(channelId!, {
        fid: currFid,
      })}
      warpcastEmbeds={[
        getCommunityFrameLink(channelId!, {
          fid: currFid,
        }),
      ]}
      warpcastChannelId={channelId}
      navigateToCreatePageAfter={() => {
        setChannelShareModal({
          open: false,
          channelId: "",
          name: "",
        });
      }}
      hideWarpcastPoints
      hideTwitterPoints
    />
  );
}
