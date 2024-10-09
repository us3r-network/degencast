import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Search } from "~/components/common/Icons";
import { EditIcon, WandSparklesIcon } from "~/components/common/SvgIcons";
import { SECONDARY_COLOR } from "~/constants";

export function SearchLink() {
  return (
    <Link href="/search" asChild>
      <Button className="p-0 native:p-0">
        <Search size={24} color={SECONDARY_COLOR} />
      </Button>
    </Link>
  );
}

export function PostLink() {
  return (
    <Link href="/create" asChild>
      <Button className="p-0 native:p-0">
        <EditIcon className=" h-6 w-6 cursor-pointer stroke-secondary" />
      </Button>
    </Link>
  );
}

export function PointLink() {
  return (
    <Link href="/point" asChild>
      <Button className="p-0 native:p-0">
        <WandSparklesIcon />
      </Button>
    </Link>
  );
}
