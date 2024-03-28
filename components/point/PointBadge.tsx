import { Atom } from "../common/Icons";
import { Badge } from "../ui/badge";
import { Text } from "../ui/text";

export default function PointBadge({ value }: { value: number }) {
  return (
    <Badge className="flex h-6 w-fit flex-row items-center gap-1 bg-[#F41F4C] px-2 py-0">
      <Atom color="#FFFFFF" className="h-4 w-4" />
      <Text className=" text-base text-white">{value}</Text>
    </Badge>
  );
}
