import { useCallback, useState, useEffect } from "react";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import IListing from "../interfaces/IListing";

export function useAllListings(
  omitExpired: boolean,
  managerID?: string
): [IListing[], boolean] {
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

      // Filter out expired listings for map pages
      if (omitExpired) {
        const nonExpiredListings = listings.filter(
          (listing) => new Date(listing.expiryDate) < new Date()
        );
        setAllListings(nonExpiredListings);
      } else {
        setAllListings(listings);
      }

      // Filter by managerID if provided
      if (managerID) {
        const managersListings = listings.filter(
          (listing) => listing.managerID === managerID
        );
        setAllListings(managersListings);
      } else {
        setAllListings(listings);
      }

      setIsLoadingAllListings(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerID]);

  useEffect(() => {
    getAllListings();
  }, [getAllListings]);

  return [allListings, isLoadingAllListings];
}
