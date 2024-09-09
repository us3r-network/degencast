import { CardWarper, PageContent } from "~/components/layout/content/Content";
import Curators from "~/components/rank/Curators";

export default function CuratorsScreen() {
  return (
    <PageContent>
      <CardWarper>
        <Curators />
      </CardWarper>
    </PageContent>
  );
}
