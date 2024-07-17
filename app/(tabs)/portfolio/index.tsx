import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";
import { PageContent } from "~/components/layout/content/Content";
import { Card, CardContent } from "~/components/ui/card";

export default function PortfolioScreen() {
  return <Redirect href="/portfolio/toekns" />;
}

export function PortfolioPageContent({ children }: PropsWithChildren) {
  return (
    <PageContent>
      <Card className="h-full w-full rounded-2xl rounded-b-none p-4 pb-0">
        <CardContent className="h-full w-full p-0">{children}</CardContent>
      </Card>
    </PageContent>
  );
}