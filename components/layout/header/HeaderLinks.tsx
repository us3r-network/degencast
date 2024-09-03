import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Search } from "~/components/common/Icons";
import { EditIcon } from "~/components/common/SvgIcons";

export function SearchLink() {
  return (
    <Link href="/search" asChild>
      <Button variant={"link"} className="m-0 p-0">
        <Search size={24} className="stroke-secondary" />
      </Button>
    </Link>
  );
}

export function PostLink() {
  return (
    <Link href="/create" asChild>
      <Button variant={"link"} className="m-0 p-0">
        <EditIcon className=" h-6 w-6 cursor-pointer stroke-secondary" />
      </Button>
    </Link>
  );
}
