import {
  fetchEmbedCasts,
  selectEmbedCasts,
} from "~/features/cast/embedCastsSlice";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useLoadEmbedCastsMetadataMetadata(opts: {
  embedCastIds: Array<{
    fid: number;
    hash: string;
  }>;
}) {
  const { embedCastIds } = opts;
  const dispatch = useAppDispatch();
  const { pendingCasts, casts } = useAppSelector(selectEmbedCasts);
  const embedCastId = embedCastIds?.[0];
  const loading = embedCastId?.hash && pendingCasts.includes(embedCastId?.hash);
  const embedCastsMetadata = casts[embedCastId?.hash];

  const loadEmbedCastsMetadata = async () => {
    if (loading) return;
    if (embedCastIds.length === 0) return;
    dispatch(fetchEmbedCasts({ embedCastIds }));
  };

  return {
    loading,
    embedCastsMetadata,
    loadEmbedCastsMetadata,
  };
}
