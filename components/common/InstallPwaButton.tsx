import React, { useEffect, useState } from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "~/components/ui/button";
import { Download } from "./Icons";

export default function InstallPWAButton() {
  const [supportsPWA, setSupportsPWA] = useState(true);
  const [promptInstall, setPromptInstall] = useState<any>();

  useEffect(() => {
    const handler = (e: any) => {
      console.log("window", window)
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onPress = (e: GestureResponderEvent) => {
    e.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <Button size={"icon"} className="rounded-full bg-white" onPress={onPress}>
      <Download />
    </Button>
  );
}
