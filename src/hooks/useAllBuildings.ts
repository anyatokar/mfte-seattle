import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../db/firebase";
import { useAllListings } from "./useListings";
import { listingStatusEnum } from "../types/enumTypes";
import IBuilding from "../interfaces/IBuilding";
import { useSavedBuildings } from "./useSavedBuildings";
import IListing from "../interfaces/IListing";
import ISavedBuilding from "../interfaces/ISavedBuilding";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<IBuilding[]>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const [allListings, isLoadingAllListings] = useAllListings(true);
  const [savedBuildings, isLoadingSavedBuildings] = useSavedBuildings();

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

    const findSavedData = (
      buildingID: IBuilding["buildingID"]
    ): ISavedBuilding | undefined => {
      // This finds the first active entry.
      return savedBuildings.find(
        (savedBuilding) => savedBuilding.buildingID === buildingID
      );
    };

    setIsLoadingAllBuildings(true);
    const q = query(collection(db, "buildings"), orderBy("buildingName"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (isLoadingAllListings) {
        console.log("Loading all listings");
        return;
      }

      if (isLoadingSavedBuildings) {
        console.log("Loading saved buildings");
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
        const savedData = findSavedData(building.buildingID);
        // If there's a matching saved building, add this data to the building
        if (savedData !== undefined) {
          building.savedData = {
            note: savedData.note,
            noteTimestamp: savedData.noteTimestamp,
          };
        }

        buildings.push(building);
      });

      const sortedBuildings = buildings.sort(
        (buildingA: IBuilding, buildingB: IBuilding) => {
          const hasListingA =
            buildingA.listing?.listingStatus === listingStatusEnum.ACTIVE;
          const hasListingB =
            buildingB.listing?.listingStatus === listingStatusEnum.ACTIVE;

          if (hasListingA && !hasListingB) {
            return -1;
          } else {
            return 1;
          }
        }
      );

      // TODO: remove
      console.log(
        sortedBuildings.find((building) => building.buildingName === "Batik")
      );
      setAllBuildings(sortedBuildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
    // getAllBuildings function is recreated when listings deps change.
    // This triggers the useEffect below, since the function is in the deps array.
  }, [allListings, isLoadingAllListings]);

  // savedBuildings, isLoadingSavedBuildings

  useEffect(() => {
    const unsubscribe = getAllBuildings();
    return () => {
      unsubscribe();
    };
  }, [getAllBuildings]);

  return [allBuildings, isLoadingAllBuildings];
};
