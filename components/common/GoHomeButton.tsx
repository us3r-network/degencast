import { cn } from "~/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import { Home } from "./Icons";

export default function GoHomeButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("rounded-full", className)}
      size={"icon"}
      variant={"ghost"}
      {...props}
    >
      <Home className=" stroke-primary" size={16} strokeWidth={3} />
    </Button>
  );
}
