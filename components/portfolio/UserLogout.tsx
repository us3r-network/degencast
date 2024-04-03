import { usePrivy } from "@privy-io/react-auth";
import { LogOut } from "../Icons";
import { Button } from "../ui/button";
import useAuth from "~/hooks/user/useAuth";

export default function UserLogout() {
  const { ready, logout } = usePrivy();
  const { authenticated } = useAuth();
  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Button className="bg-white" onPress={async() => {
        await logout();
      }}>
      <LogOut />
    </Button>
  );
}
