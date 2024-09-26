import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectUserAuth,
  fetchDegencastUserInfo,
  clearDegencastUserInfo,
} from "~/features/user/userAuthSlice";

export default function useDegencastUserInfo() {
  const { degencastUserInfo, degencastUserInfoRequestStatus } =
    useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();

  const loading = degencastUserInfoRequestStatus === "pending";
  const loadDegencastUserInfo = useCallback(async () => {
    dispatch(fetchDegencastUserInfo());
  }, []);

  const clearDegencastUserInfoAction = useCallback(() => {
    dispatch(clearDegencastUserInfo());
  }, []);
  return {
    degencastUserInfo,
    loading,
    loadDegencastUserInfo,
    clearDegencastUserInfo: clearDegencastUserInfoAction,
  };
}
