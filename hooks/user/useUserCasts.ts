import { useRef, useState } from "react";
import { getProfileFeeds } from "~/services/farcaster/api";
import {
  ProfileFeedsPageInfo,
  ProfileFeedsGroups,
  SocialPlatform,
  ProfileFeedsDataItem,
} from "~/services/farcaster/types";
import { userDataObjFromArr } from "~/utils/farcaster/user-data";

const PAGE_SIZE = 30;

export default function useUserCasts() {
  const [casts, setCasts] = useState<Array<ProfileFeedsDataItem>>([]);
  const [loading, setLoading] = useState(false);
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});
  const fidRef = useRef("");
  const pageInfoRef = useRef<ProfileFeedsPageInfo>({
    hasNextPage: false,
    endFarcasterCursor: "",
    // endLensCursor: '',
  });

  const loadCasts = async (opts?: {
    keyword?: string;
    // lensProfileId?: string;
    fid?: string;
    platforms?: SocialPlatform[];
    group?: ProfileFeedsGroups;
  }) => {
    // const { lensProfileId = '', fid = '' } = opts || {};
    const { fid = "" } = opts || {};
    if (fid !== fidRef.current) {
      fidRef.current = fid;
      setCasts([]);
      setFarcasterUserDataObj({});
      pageInfoRef.current = {
        hasNextPage: true,
        endFarcasterCursor: "",
      };
    }
    const { hasNextPage, endFarcasterCursor } = pageInfoRef.current;
    if (hasNextPage === false) {
      return;
    }

    setLoading(true);
    try {
      const res = await getProfileFeeds({
        endFarcasterCursor: endFarcasterCursor,
        // endLensCursor: pageInfo.endLensCursor,
        keyword: opts?.keyword,
        // lensProfileId,
        fid,
        platforms:
          opts?.platforms && opts?.platforms?.length > 0
            ? opts.platforms
            : undefined,
        group: opts?.group,
        // lensAccessToken,
      });
      if (res.data.code !== 0) {
        throw new Error(res.data.msg);
      }
      const { data } = res.data;
      const { data: casts, farcasterUserData, pageInfo } = data;

      setCasts((pre) => [...pre, ...casts]);
      pageInfoRef.current = pageInfo;

      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);
        setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    casts,
    farcasterUserDataObj,
    loadCasts,
  };
}
