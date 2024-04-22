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
        className={cn("size-10 rounded-full bg-white", className)}
        onPress={() => {
          console.log("websiteLink", websiteLink);

          setOpen(true);
        }}
        {...props}
      >
        <Share2 className={cn(" fill-primary stroke-primary")} />
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
