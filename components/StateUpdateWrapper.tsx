import { usePrivy } from "@privy-io/react-auth";
import { PropsWithChildren, useEffect } from "react";
import useUserAction from "~/hooks/user/useUserAction";
import useUserTotalPoints from "~/hooks/user/useUserTotalPoints";
import useSeenCasts from "~/hooks/user/useSeenCasts";
import { getUserToken } from "~/services/shared/api/request";
import { injectPrivyToken } from "~/utils/privy/injectToken";

const waitToken = async () => {
  const token = getUserToken();
  if (!token) {
    await injectPrivyToken();
  }
};

export default function StateUpdateWrapper({ children }: PropsWithChildren) {
  const { authenticated } = usePrivy();

  // user action
  const { fetchUserActionConfig, submitUnreportedActions } = useUserAction();
  const { fetchTotalPoints } = useUserTotalPoints();

  const { submitUnreportedViewCasts } = useSeenCasts();

  useEffect(() => {
    fetchUserActionConfig();
  }, [fetchUserActionConfig]);

  useEffect(() => {
    (async () => {
      if (authenticated) {
        await waitToken(); // TODO 注入token时机优化后删除
        await submitUnreportedActions();
        await fetchTotalPoints();
      }
    })();
  }, [authenticated, fetchTotalPoints, submitUnreportedActions]);

  useEffect(() => {
    (async () => {
      if (authenticated) {
        await waitToken(); // TODO 注入token时机优化后删除
        submitUnreportedViewCasts();
      }
    })();
  }, [authenticated, submitUnreportedViewCasts]);

  return children;
}
