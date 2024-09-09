import { useRef, useState } from "react";
import { getChannelAttentionToken } from "~/services/community/api/attention-token";
import { AttentionTokenEntity } from "~/services/community/types/attention-token";
import { ApiRespCode, AsyncRequestStatus } from "~/services/shared/types";

export default function useLoadAttentionTokenInfo(props?: {
  channelId: string;
}) {
  const [tokenInfo, setTokenInfo] = useState<AttentionTokenEntity | null>(null);
  const [status, setStatus] = useState(AsyncRequestStatus.IDLE);
  const channelIdRef = useRef(props?.channelId || "");

  const loading = status === AsyncRequestStatus.PENDING;
  const rejected = status === AsyncRequestStatus.REJECTED;

  const loadTokenInfo = async () => {
    const channelId = channelIdRef.current;
    setStatus(AsyncRequestStatus.PENDING);
    try {
      const resp = await getChannelAttentionToken({ channelId });
      if (resp.data.code !== ApiRespCode.SUCCESS) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      setTokenInfo(data);
      setStatus(AsyncRequestStatus.FULFILLED);
    } catch (err) {
      console.error(err);
      setStatus(AsyncRequestStatus.REJECTED);
    } finally {
    }
  };

  return {
    loading,
    rejected,
    tokenInfo,
    loadTokenInfo,
  };
}
