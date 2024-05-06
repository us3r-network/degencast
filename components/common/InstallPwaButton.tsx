import React, { useEffect, useState } from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {};

export default function InstallPWAButtonconst({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  const [supportsPWA, setSupportsPWA] = useState(true);
  const [promptInstall, setPromptInstall] = useState<any>();

  useEffect(() => {
    const handler = (e: any) => {
      console.log("window in beforeinstallprompt", window);
      e.preventDefault();
      console.log("we are being triggered :D", e);
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    console.log("window", window);
    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onPress = (e: GestureResponderEvent) => {
    e.preventDefault();
    if (!promptInstall) {
      console.log("promptInstall not available", promptInstall, supportsPWA);
      return;
    }
    promptInstall.prompt();
  };

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled={!supportsPWA}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}
