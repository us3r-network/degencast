import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { ChevronLeft } from "./Icons";
import { Pressable, PressableProps } from "react-native";
import { BackArrowIcon } from "./SvgIcons";

export default function GoBackButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("rounded-full p-0", className)}
      size={"icon"}
      variant={"ghost"}
      {...props}
    >
      <ChevronLeft className=" stroke-primary" />
    </Button>
  );
}

export function GoBackButtonBgPrimary({ className, ...props }: PressableProps) {
  return (
    <Pressable className={cn("", className)} {...props}>
      {/* <ChevronLeft className="stroke-primary-foreground" /> */}
      <BackArrowIcon />
    </Pressable>
  );
}
