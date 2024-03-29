import { usePrivy } from "@privy-io/react-auth";
import { FontAwesome } from "@expo/vector-icons";
import { LogOut } from "../Icons";
import { Button } from "../ui/button";
import { clearPrivyToken } from "~/utils/privy/injectToken";

export default function UserLogout() {
  const { ready, authenticated, logout } = usePrivy();
  if (!ready || !authenticated) {
    return null;
  }
  // return <FontAwesome.Button name="sign-out" size={25} onPress={logout} />;
  return (
    <Button className="bg-white" onPress={async() => {
        await logout();
        clearPrivyToken()
      }}>
      <LogOut />
    </Button>
  );
}
