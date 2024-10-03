import { useCallback, useState, useEffect } from "react";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import IListing from "../interfaces/IListing";

export function useAllListings(
  listingIDs?: string[] | null
): [IListing[], boolean] {
  const [allListings, setAllListings] = useState([] as Array<IListing>);
  const [isLoadingAllListings, setIsLoadingAllListings] = useState(false);

  const getAllListings = useCallback(() => {
    setIsLoadingAllListings(true);

    const q = query(collection(db, "listings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Getting listings.");
      const listings: Array<IListing> = [];
      querySnapshot.forEach((doc) => {
        listings.push(doc.data() as IListing);
      });

      // Filter by listingIDs if provided
      if (listingIDs && listingIDs.length > 0) {
        const filteredListings = listings.filter((listing) =>
          listingIDs.includes(listing.listingID)
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
  }, [listingIDs]);

  useEffect(() => {
    getAllListings();
  }, [getAllListings]);

  return [allListings, isLoadingAllListings];
}
