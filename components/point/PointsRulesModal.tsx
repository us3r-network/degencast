import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Text } from "../ui/text";
import { PointsRules } from "./PointsRulesPrevious";

export default function PointsRulesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border max-sm:w-screen">
        <DialogHeader>
          <Text className=" text-base font-medium">$CAST</Text>
        </DialogHeader>
        <PointsRules onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
