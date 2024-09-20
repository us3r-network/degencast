import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  CreateCastPreviewData,
  selectCastPage,
  upsertCreateCastPreviewData,
} from "~/features/cast/castPageSlice";

export default function useCreateCastPreview() {
  const dispatch = useAppDispatch();
  const { createCastPreviewData } = useAppSelector(selectCastPage);
  const upsertCreateCastPreviewDataAction = useCallback(
    (data: CreateCastPreviewData) =>
      dispatch(upsertCreateCastPreviewData(data)),
    [],
  );

  return {
    createCastPreviewData,
    upsertCreateCastPreviewData: upsertCreateCastPreviewDataAction,
  };
}
