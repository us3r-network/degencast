import React from "react";
import { Text } from "~/components/ui/text";

const COMING_SOON_TEXT = "Coming soon";
export const COMING_SOON_TAG = `[${COMING_SOON_TEXT}]`;

type TextWithTagProps = React.ComponentPropsWithoutRef<typeof Text> & {
  children: string;
};

export default function TextWithTag({ children }: TextWithTagProps) {
  if (children.endsWith(COMING_SOON_TAG)) {
    return (
      <Text>
        <Text>{children.replace(COMING_SOON_TAG, "")}</Text>
        <Text className="rounded-md bg-secondary px-2 text-xs font-medium ">
          {COMING_SOON_TEXT}
        </Text>
      </Text>
    );
  } else {
    return <Text>{children}</Text>;
  }
}
