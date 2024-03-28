import { Info, LucideIcon, MoonStar, Sun, Atom } from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Info);
interopIcon(MoonStar);
interopIcon(Sun);
interopIcon(Atom);

export { Info, MoonStar, Sun, Atom };
