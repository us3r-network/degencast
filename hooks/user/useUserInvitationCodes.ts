import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectInviteCode,
  fetchMyInvitationCodes,
  clearInvitationCodes as clearInvitationCodesAction,
} from "~/features/user/inviteCodeSlice";
import { AsyncRequestStatus } from "~/services/shared/types";

export default function useUserInvitationCodes() {
  const { invitationCodes, invitationCodesRequestStatus } =
    useAppSelector(selectInviteCode);
  const dispatch = useAppDispatch();

  const loading = invitationCodesRequestStatus === AsyncRequestStatus.PENDING;
  const idle = invitationCodesRequestStatus === AsyncRequestStatus.IDLE;
  const rejected = invitationCodesRequestStatus === AsyncRequestStatus.REJECTED;
  const loadMyInvitationCodes = useCallback(async () => {
    dispatch(fetchMyInvitationCodes());
  }, []);
  const clearMyInvitationCodes = useCallback(async () => {
    dispatch(clearInvitationCodesAction());
  }, []);

  return {
    invitationCodes,
    loading,
    idle,
    rejected,
    loadMyInvitationCodes,
    clearMyInvitationCodes,
  };
}
