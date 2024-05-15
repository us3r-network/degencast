import { cn } from "~/lib/utils";
import { Share2 } from "../common/Icons";
import { Button, ButtonProps } from "../ui/button";
import PlatformSharingModal from "./PlatformSharingModal";
import { useState } from "react";
import {
  getAppShareTextWithTwitter,
  getAppShareTextWithWarpcast,
  getCommunityShareTextWithTwitter,
  getCommunityShareTextWithWarpcast,
} from "~/utils/platform-sharing/text";
import {
  getAppFrameLink,
  getAppWebsiteLink,
  getCommunityFrameLink,
  getCommunityWebsiteLink,
  getTradePageFrameLink,
  getTradePageWebsiteLink,
} from "~/utils/platform-sharing/link";

export default function PlatformSharingButton({
  text,
  twitterText,
  warpcastText,
  websiteLink,
  frameLink,
  className,
  ...props
}: ButtonProps & {
  text?: string;
  twitterText?: string;
  warpcastText?: string;
  websiteLink: string;
  frameLink: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className={cn("bg-transparent p-0", className)}
        onPress={() => {
          setOpen(true);
        }}
        {...props}
      >
        <Share2
          className={cn(
            " size-5 fill-primary-foreground stroke-primary-foreground",
          )}
        />
      </Button>
      <PlatformSharingModal
        open={open}
        onOpenChange={(open) => setOpen(open)}
        text={text}
        twitterText={twitterText}
        warpcastText={warpcastText}
        websiteLink={websiteLink}
        frameLink={frameLink}
      />
    </>
  );
}

export function ExploreSharingButton({ fid }: { fid: string | number }) {
  return (
    <PlatformSharingButton
      twitterText={getAppShareTextWithTwitter()}
      warpcastText={getAppShareTextWithWarpcast()}
      websiteLink={getAppWebsiteLink({
        fid,
      })}
      frameLink={getAppFrameLink({
        fid,
      })}
    />
  );
}

export function TradeSharingButton({ fid }: { fid: string | number }) {
  return (
    <PlatformSharingButton
      twitterText={getAppShareTextWithTwitter()}
      warpcastText={getAppShareTextWithWarpcast()}
      websiteLink={getTradePageWebsiteLink({
        fid,
      })}
      frameLink={getTradePageFrameLink({
        fid,
      })}
    />
  );
}

export function CommunitySharingButton({
  name,
  channelId,
  currFid,
}: {
  name: string;
  channelId: string;
  currFid: string | number;
}) {
  return (
    <PlatformSharingButton
      twitterText={getCommunityShareTextWithTwitter(name || "")}
      warpcastText={getCommunityShareTextWithWarpcast(name || "")}
      websiteLink={getCommunityWebsiteLink(channelId, {
        fid: currFid,
      })}
      frameLink={getCommunityFrameLink(channelId, {
        fid: currFid,
      })}
    />
  );
}
