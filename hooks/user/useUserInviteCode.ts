import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useGlobalSearchParams } from "expo-router";
import {
  selectInviteCode,
  setUsedOtherInviteFid,
  clearUsedOtherInviteFid,
} from "~/features/user/inviteCodeSlice";

export default function useUserInviteCode() {
  const globalParams = useGlobalSearchParams<{ inviteFid?: string }>();
  const { inviteFid: linkParamInviteFid } = globalParams || {};

  const dispatch = useAppDispatch();

  const { usedOtherInviteFid } = useAppSelector(selectInviteCode);

  const checkInviteLinkParams = useCallback(async () => {
    if (usedOtherInviteFid || !linkParamInviteFid) return;
    dispatch(setUsedOtherInviteFid(linkParamInviteFid));
  }, [linkParamInviteFid, usedOtherInviteFid]);

  const clearUsedOtherInviteData = useCallback(async () => {
    dispatch(clearUsedOtherInviteFid());
  }, []);

  return {
    usedOtherInviteFid,
    checkInviteLinkParams,
    clearUsedOtherInviteData,
  };
}
