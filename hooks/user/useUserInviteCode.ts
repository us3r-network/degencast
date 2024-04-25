import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useGlobalSearchParams } from "expo-router";
import {
  selectInviteCode,
  setUsedInviterFid,
  clearUsedInviterFid,
} from "~/features/user/inviteCodeSlice";

export default function useUserInviteCode() {
  const globalParams = useGlobalSearchParams<{ inviteFid?: string }>();
  const { inviteFid: linkParamInviteFid } = globalParams || {};

  const dispatch = useAppDispatch();

  const { usedInviterFid } = useAppSelector(selectInviteCode);

  const checkInviteLinkParams = useCallback(async () => {
    if (usedInviterFid || !linkParamInviteFid) return;
    dispatch(setUsedInviterFid(linkParamInviteFid));
  }, [linkParamInviteFid, usedInviterFid]);

  const clearUsedInviterData = useCallback(async () => {
    dispatch(clearUsedInviterFid());
  }, []);

  return {
    usedInviterFid,
    checkInviteLinkParams,
    clearUsedInviterData,
  };
}
