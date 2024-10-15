import { useCallback, useState, useEffect } from "react";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import IListing from "../interfaces/IListing";

export function useAllListings(managerID?: string): [IListing[], boolean] {
  const [allListings, setAllListings] = useState([] as Array<IListing>);
  const [isLoadingAllListings, setIsLoadingAllListings] = useState(false);

  const getAllListings = useCallback(() => {
    setIsLoadingAllListings(true);

    const q = query(collection(db, "listingsTEST"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Getting listings.");
      const listings: Array<IListing> = [];
      querySnapshot.forEach((doc) => {
        listings.push(doc.data() as IListing);
      });

      // Filter by managerID if provided
      if (managerID) {
        const filteredListings = listings.filter(
          (listing) => listing.managerID === managerID
        );
        setAllListings(filteredListings);
      } else {
        setAllListings(listings);
      }

      setIsLoadingAllListings(false);
    });

    return () => {
      unsubscribe();
    };
  }, [managerID]);

  useEffect(() => {
    getAllListings();
  }, [getAllListings]);

  return [allListings, isLoadingAllListings];
}
