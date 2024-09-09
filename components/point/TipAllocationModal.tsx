import { View } from "react-native";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Text } from "../ui/text";

export default function TipAllocationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const items = [
    { role: "Creator", value: 50 },
    { role: "Channel Reward Pool", value: 30 },
    { role: "Channel host", value: 10 },
    { role: "Tipper", value: 10 },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" box-border w-[430px] max-sm:w-screen">
        <DialogHeader>
          <Text>Tip Allocation</Text>
        </DialogHeader>
        <View className="mt-5 flex flex-col gap-4">
          {items.map((item, index) => (
            <AllocationItem key={index} {...item} />
          ))}
        </View>
      </DialogContent>
    </Dialog>
  );
}

function AllocationItem({ role, value }: { role: string; value: number }) {
  return (
    <View className="flex w-full flex-row items-center justify-between">
      <Text>{role}</Text>
      <Text className="font-normal text-secondary">{value}%</Text>
    </View>
  );
}
