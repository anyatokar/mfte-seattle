import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IBuilding from "../interfaces/IBuilding";
import { useAllListings } from "./useListings";
import { listingStatusEnum } from "../types/enumTypes";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<IBuilding[]>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const allListings = useAllListings(true)[0];

  const getAllBuildings = useCallback(() => {
    setIsLoadingAllBuildings(true);
    const q = query(collection(db, "buildings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Buildings snapshot.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        const building = doc.data() as IBuilding;
        const listing = findListing(building.buildingID)
        // If there's a matching listing, add this data to the building
        if (listing !== undefined) {
          building.listingData = {...listing};
        }
        buildings.push(building);
      });

      setAllBuildings(buildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = getAllBuildings();
    return () => {
      unsubscribe();
    };
  }, [getAllBuildings]);

  const findListing = (
    buildingID: IBuilding["buildingID"]
  ) => {
    // This finds the first active entry.
    return allListings.find(
      (listing) =>
        listing.buildingID === buildingID &&
        listing.listingStatus === listingStatusEnum.ACTIVE
    );
  };

  return [allBuildings, isLoadingAllBuildings];
};
