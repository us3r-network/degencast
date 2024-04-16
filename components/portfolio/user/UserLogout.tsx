import { usePrivy } from "@privy-io/react-auth";
import { LogOut } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import useAuth from "~/hooks/user/useAuth";

export default function UserLogout() {
  const { ready, logout } = usePrivy();
  const { authenticated } = useAuth();
  if (!ready || !authenticated) {
    return null;
  }
  return (
    <Button size={"icon"} className="bg-white rounded-full" onPress={async() => {
        await logout();
      }}>
      <LogOut />
    </Button>
  );
}
