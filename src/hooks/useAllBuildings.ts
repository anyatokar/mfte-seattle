import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import { useAllListings } from "./useListings";
import { genericSort } from "../utils/genericSort";
import { listingStatusEnum } from "../types/enumTypes";
import IBuilding from "../interfaces/IBuilding";
import ISorter from "../interfaces/ISorter";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<IBuilding[]>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const [allListings, isLoadingAllListings] = useAllListings(true);

  const getAllBuildings = useCallback(() => {
    const findListing = (buildingID: IBuilding["buildingID"]) => {
      // This finds the first active entry.
      return allListings.find(
        (listing) =>
          listing.buildingID === buildingID &&
          listing.listingStatus === listingStatusEnum.ACTIVE
      );
    };

    setIsLoadingAllBuildings(true);
    const q = query(collection(db, "buildings"));

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

      const activeSorter: ISorter<IBuilding> = {
        property: "buildingName",
        isDescending: false,
      };

      const sortedBuildings = buildings.sort(
        (buildingA: IBuilding, buildingB: IBuilding) => {
          const hasListingA =
            buildingA.listing?.listingStatus === listingStatusEnum.ACTIVE;
          const hasListingB =
            buildingB.listing?.listingStatus === listingStatusEnum.ACTIVE;

          if (hasListingA && !hasListingB) return -1;
          if (!hasListingA && hasListingB) return 1;

          return genericSort(buildingA, buildingB, activeSorter);
        }
      );

      setAllBuildings(sortedBuildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
  }, [allListings, isLoadingAllListings]);

  useEffect(() => {
    const unsubscribe = getAllBuildings();
    return () => {
      unsubscribe();
    };
  }, [getAllBuildings]);

  return [allBuildings, isLoadingAllBuildings];
};
