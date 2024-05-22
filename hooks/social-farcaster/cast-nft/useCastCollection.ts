import { useCallback } from "react";
import { useAccount } from "wagmi";
import {
  fetchCastCollections,
  postCastCollection,
  selectCastCollection,
  upsertToCastCollection,
} from "~/features/cast/castCollectionSlice";
import { AsyncRequestStatus } from "~/services/shared/types";
import { ZoraCollectionEntity } from "~/services/zora-collection/types";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

export default function useCastCollection() {
  const { address, chainId } = useAccount();
  const dispatch = useAppDispatch();
  const { collections, status } = useAppSelector(selectCastCollection);

  const getCastCollections = useCallback(() => {
    if (!address || !chainId) return;
    dispatch(
      fetchCastCollections({
        chainId,
        creatorAddress: address,
      }),
    );
  }, [address, chainId]);

  const findCollectionWithCache = useCallback(
    (creatorAddress: string, chainId: number) => {
      return collections?.[creatorAddress]?.find(
        (collection) =>
          collection.creatorAddress === creatorAddress &&
          collection.chainId === chainId,
      );
    },
    [collections],
  );

  const addCollectionToCache = useCallback(
    (collection: ZoraCollectionEntity) => {
      dispatch(upsertToCastCollection(collection));
    },
    [],
  );

  const submitCollection = useCallback(
    (collection: {
      chainId: number;
      contractAddress: string;
      creatorAddress: string;
    }) => {
      dispatch(postCastCollection(collection));
    },
    [],
  );

  const castCollectionsLoading = status === AsyncRequestStatus.PENDING;

  return {
    collections,
    castCollectionsLoading,
    fetchCastCollections: getCastCollections,
    submitCollection,
    findCollectionWithCache,
    addCollectionToCache,
  };
}
