import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import { useAllListings } from "./useListings";
import { listingStatusEnum } from "../types/enumTypes";
import IBuilding from "../interfaces/IBuilding";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<IBuilding[]>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const allListings = useAllListings(true)[0];

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

      setAllBuildings(buildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
  }, [allListings]);

  useEffect(() => {
    const unsubscribe = getAllBuildings();
    return () => {
      unsubscribe();
    };
  }, [getAllBuildings]);

  return [allBuildings, isLoadingAllBuildings];
};
