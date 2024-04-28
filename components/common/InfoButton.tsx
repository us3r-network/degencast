import React from "react";
import { Info } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import TextWithTag from "./TextWithTag";
import { UnorderedList } from "./UnorderedList";
export function InfoButton({
  title,
  info,
}: {
  title: string;
  info: string | string[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link"  className="p-0">
          <Info className="size-4 text-secondary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen border-none">
        <DialogHeader>
          <DialogTitle><TextWithTag>{title}</TextWithTag></DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {typeof info === "string" ? (
            <TextWithTag>{info}</TextWithTag>
          ) : (
            <UnorderedList texts={info} />
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
