import { ErrorInfo } from "~/components/trade/TranasactionResult";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export default function ProposalErrorModal({
  message,
  open,
  onOpenChange,
}: {
  message: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
      }}
    >
      <DialogContent
        className="w-screen"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={cn("flex gap-2")}>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <ErrorInfo
          error={message}
          buttonText="Close"
          buttonAction={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
