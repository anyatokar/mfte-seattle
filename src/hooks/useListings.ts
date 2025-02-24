import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../db/firebase";
import IListing from "../interfaces/IListing";

export function useAllListings(
  omitExpired: boolean,
  managerID?: string
): [IListing[], boolean] {
  const [allListings, setAllListings] = useState<IListing[]>([]);
  const [isLoadingAllListings, setIsLoadingAllListings] = useState(true);

  const getAllListings = useCallback(() => {
    setIsLoadingAllListings(true);

    let constraints = [];

    if (omitExpired) {
      constraints.push(where("expiryDate", ">=", new Date().toISOString()));
    }

    if (managerID) {
      constraints.push(where("managerID", "==", managerID));
    }

    const q = query(collection(db, "listings"), ...constraints);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Listings snapshot.");
      const listings: IListing[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as IListing),
        // Temp fix for key name change availData >> availDataArray
        availDataArray: doc.data().availData,
      }));

      setAllListings(listings);
      setIsLoadingAllListings(false);
    });

    return unsubscribe;
  }, [omitExpired, managerID]);

  useEffect(() => {
    const unsubscribe = getAllListings();
    return () => {
      unsubscribe();
    };
  }, [getAllListings]);

  return [allListings, isLoadingAllListings];
}
