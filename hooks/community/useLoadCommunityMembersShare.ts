import { useRef, useState } from "react";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

const PAGE_SIZE = 20;
const mockApi = async ({
  start,
  end,
  channelId,
}: {
  start: number;
  end: number;
  channelId: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    data: {
      code: 0,
      msg: "",
      data: {
        membersShare: Array.from({ length: PAGE_SIZE }).map((_, i) => ({
          id: start + i + 1,
        })),
        pageInfo: {
          hasNextPage: true,
          endIndex: end,
        },
      },
    },
  };
};
export default function useLoadCommunityMembersShare() {
  const [membersShare, setMembersShare] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const channelIdRef = useRef("");
  const pageInfoRef = useRef({
    hasNextPage: true,
    endIndex: 0,
  });

  const loadMembersShare = async (channelId: string) => {
    if (channelId !== channelIdRef.current) {
      channelIdRef.current = channelId;
      setMembersShare([]);
      setFarcasterUserDataObj({});
      pageInfoRef.current = {
        hasNextPage: true,
        endIndex: 0,
      };
    }
    const { hasNextPage, endIndex } = pageInfoRef.current;

    if (hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await mockApi({
        start: endIndex === 0 ? 0 : endIndex + 1,
        end: endIndex === 0 ? PAGE_SIZE - 1 : endIndex + PAGE_SIZE,
        channelId,
      });
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg);
      }
      const { data } = resp.data;
      // const { membersShare, farcasterUserData, pageInfo } = data;
      const { membersShare, pageInfo } = data;

      setMembersShare((pre) => [...pre, ...membersShare]);
      pageInfoRef.current = pageInfo;

      // if (farcasterUserData.length > 0) {
      //   const userDataObj = userDataObjFromArr(farcasterUserData);
      //   setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    membersShare,
    farcasterUserDataObj,
    loadMembersShare,
  };
}
