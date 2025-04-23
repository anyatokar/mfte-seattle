import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../db/firebase";
import { useAllListings } from "./useListings";
import { listingStatusEnum } from "../types/enumTypes";
import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<IBuilding[]>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const [allListings, isLoadingAllListings] = useAllListings(true);

  // The function is created once on mount, then it only gets re-created when the dependencies change.
  // Each time the function is created or re-created, the useEffect hook runs to execute the function.
  const getAllBuildings = useCallback(() => {
    const findListing = (
      buildingID: IBuilding["buildingID"]
    ): IListing | undefined => {
      // This finds the first active entry.
      return allListings.find(
        (listing) =>
          listing.buildingID === buildingID &&
          listing.listingStatus === listingStatusEnum.ACTIVE
      );
    };

    setIsLoadingAllBuildings(true);
    const q = query(collection(db, "buildings_3"), orderBy("buildingName"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (isLoadingAllListings) {
        console.log("Loading all listings");
        return;
      }

      console.log("Buildings snapshot.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        const building = doc.data() as IBuilding;
        const listing = findListing(building.buildingID);
        // If there's a matching listing, add this data to the building
        if (listing !== undefined) {
          building.listing = { ...listing };
        }
        buildings.push(building);
      });
      // Order: 1. available 2. unknown availability 3. not available
      const sortedBuildings = buildings.sort((a: IBuilding, b: IBuilding) => {
        const aNoneAvailable = a.listing?.noneAvailable ?? false;
        const bNoneAvailable = b.listing?.noneAvailable ?? false;

        // If both are marked noneAvailable, don't change their order
        if (aNoneAvailable && bNoneAvailable) return 0;

        // If only one is noneAvailable, keep its position (don't swap)
        if (aNoneAvailable) return 1; // move a down
        if (bNoneAvailable) return -1; // move b down

        // Otherwise, sort by dateUpdated (most recent first)
        const aUpdated = a.listing?.dateUpdated?.toMillis?.() || 0;
        const bUpdated = b.listing?.dateUpdated?.toMillis?.() || 0;

        return bUpdated - aUpdated;
      });

      setAllBuildings(sortedBuildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
    // getAllBuildings function is recreated when listings deps change.
    // This triggers the useEffect below, since the function is in the deps array.
  }, [allListings, isLoadingAllListings]);

  useEffect(() => {
    const unsubscribe = getAllBuildings();
    return () => {
      unsubscribe();
    };
  }, [getAllBuildings]);

  return [allBuildings, isLoadingAllBuildings];
};
