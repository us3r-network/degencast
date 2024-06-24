import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectUserAuth,
  fetchCurrUserInfo,
} from "~/features/user/userAuthSlice";

export default function useCurrUserInfo() {
  const { currNeynarUserInfo, currNeynarUserInfoRequestStatus } =
    useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();

  const loading = currNeynarUserInfoRequestStatus === "pending";
  const loadCurrUserInfo = useCallback(async (fid: string | number) => {
    dispatch(fetchCurrUserInfo({ fid: Number(fid) }));
  }, []);

  return {
    currUserInfo: currNeynarUserInfo,
    loading,
    loadCurrUserInfo,
  };
}
