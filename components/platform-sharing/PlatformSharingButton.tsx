import { cn } from "~/lib/utils";
import { Share2 } from "../common/Icons";
import { Button, ButtonProps } from "../ui/button";
import PlatformSharingModal from "./PlatformSharingModal";
import { useState } from "react";

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
